import {
  HttpException,
  HttpStatus,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardStats } from 'src/modules/mongo/schemas/stats/board.stats.schema';
import { UsersService } from 'src/modules/users/users.service';
import { BoardAction } from 'src/shared/enums/actions/board.action';
import { BoardPermission } from 'src/shared/enums/board.permission';
import { NumericalTimelineChartData } from 'src/shared/interfaces/stats/NumericalTimelineChartData';
import { TimeSpentData } from 'src/shared/interfaces/stats/TimeSpentData';

@Injectable()
export class BoardStatsService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @InjectModel(BoardStats.name)
    private readonly boardStatsModel: Model<BoardStats>,
    private readonly usersService: UsersService,
  ) {}

  onModuleInit() {
    void this.setMissingLeaveDates();
  }

  onApplicationShutdown() {
    void this.setMissingLeaveDates();
  }

  private async setMissingLeaveDates() {
    await this.boardStatsModel.updateMany(
      { 'joinLeaveTimeline.leaveDate': null },
      {
        $set: {
          'joinLeaveTimeline.$[element].leaveDate': new Date(),
        },
      },
      {
        arrayFilters: [{ 'element.leaveDate': null }],
      },
    );
  }

  async initStats(boardId: string, ownerId: string): Promise<void> {
    await this.boardStatsModel.create({ boardId, ownerId });
    void this.logAction(boardId, ownerId, null, BoardAction.ADD_BOARD);
  }

  async removeStats(boardId: string): Promise<void> {
    await this.boardStatsModel.findOneAndDelete({ boardId });
  }

  async logJoin(boardId: string, userId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          joinLeaveTimeline: {
            userId,
            joinDate: new Date(),
            leaveDate: null,
          },
        },
      },
    );
    void this.logAction(boardId, userId, null, BoardAction.USER_JOIN_BOARD);
  }

  async logLeave(boardId: string, userId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      {
        boardId,
        joinLeaveTimeline: {
          $elemMatch: {
            userId,
            leaveDate: null,
          },
        },
      },
      {
        $set: {
          'joinLeaveTimeline.$.leaveDate': new Date(),
        },
      },
    );
    void this.logAction(boardId, userId, null, BoardAction.USER_LEAVE_BOARD);
  }

  async logShare(
    boardId: string,
    userId: string,
    permission: BoardPermission,
  ): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          shareTimeline: {
            timestamp: new Date(),
            userId,
            permission,
          },
        },
      },
    );
    void this.logAction(boardId, userId, null, BoardAction.SHARE_BOARD);
  }

  async logAction(
    boardId: string,
    userId: string,
    slideId: string | null,
    action: BoardAction,
  ): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          actionTimeline: {
            timestamp: new Date(),
            userId,
            slideId,
            action,
          },
        },
      },
    );
  }

  private getActiveUsersOverTimeMap(
    joinLeaveTimeline: [
      { userId: string; joinDate: Date; leaveDate: Date | null },
    ],
    startDateMs: number,
    endDateMs: number,
    aggregationIntervalMs: number,
  ): Map<number, number> {
    const activeUsersOverTimeMap = new Map<number, number>();

    for (let i = startDateMs; i <= endDateMs; i += aggregationIntervalMs) {
      activeUsersOverTimeMap.set(i, 0);
    }

    activeUsersOverTimeMap.forEach((_, aggregationPointDateMs) => {
      const usersCountedMap = new Map<string, boolean>();

      for (const joinLeaveLog of joinLeaveTimeline) {
        const joinTimeMs = joinLeaveLog.joinDate.getTime();
        const leaveTimeMs = joinLeaveLog.leaveDate
          ? joinLeaveLog.leaveDate.getTime()
          : Infinity;
        const userId = joinLeaveLog.userId;

        if (
          joinTimeMs <= aggregationPointDateMs + aggregationIntervalMs / 2 &&
          leaveTimeMs > aggregationPointDateMs - aggregationIntervalMs / 2 &&
          !usersCountedMap.get(userId)
        ) {
          activeUsersOverTimeMap.set(
            aggregationPointDateMs,
            (activeUsersOverTimeMap.get(aggregationPointDateMs) || 0) + 1,
          );
          usersCountedMap.set(userId, true);
        }
      }
    });

    return activeUsersOverTimeMap;
  }

  private convertActiveUsersOverTimeMapToChartDataArray(
    activeUsersOverTimeMap: Map<number, number>,
  ): NumericalTimelineChartData[] {
    const chartDataArray = [] as NumericalTimelineChartData[];
    activeUsersOverTimeMap.forEach((noActiveUsers, aggregationPointDateMs) => {
      if (noActiveUsers > 0) {
        chartDataArray.push({
          timestamp: new Date(aggregationPointDateMs),
          value: noActiveUsers,
        });
      }
    });
    return chartDataArray;
  }

  async getActiveUsersOverTime(
    boardId: string,
    startDate: Date,
    endDate: Date,
    aggregationIntervalMinutes: number,
  ): Promise<NumericalTimelineChartData[]> {
    if (startDate.toString() === 'Invalid Date') startDate = new Date(0);
    if (endDate.toString() === 'Invalid Date' || endDate > new Date())
      endDate = new Date();

    if (startDate >= endDate) {
      throw new HttpException('Invalid dates', HttpStatus.BAD_REQUEST);
    }

    const boardStats = await this.boardStatsModel.findOne({
      boardId,
      'joinLeaveTimeline.joinDate': { $lte: endDate },
      $or: [
        { 'joinLeaveTimeline.leaveDate': { $gte: startDate } },
        { 'joinLeaveTimeline.leaveDate': null },
      ],
    });

    if (!boardStats || !boardStats.joinLeaveTimeline) {
      return [];
    }

    const activeUsersOverTimeMap = this.getActiveUsersOverTimeMap(
      boardStats.joinLeaveTimeline,
      startDate.getTime(),
      endDate.getTime(),
      aggregationIntervalMinutes * 60 * 1000,
    );

    return this.convertActiveUsersOverTimeMapToChartDataArray(
      activeUsersOverTimeMap,
    );
  }

  async getTotalUniqeVisitors(boardId: string): Promise<number> {
    const result = await this.boardStatsModel.aggregate([
      { $match: { boardId } },
      { $unwind: '$joinLeaveTimeline' },
      { $group: { _id: '$joinLeaveTimeline.userId' } },
      { $count: 'uniqueVisitorsCount' },
    ]);

    if (!result || result.length === 0) {
      throw new HttpException(
        `Stats not found for the given boardID: ${boardId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return result[0].uniqueVisitorsCount;
  }

  private getTimesSpentMap(
    joinLeaveTimeline: [
      { userId: string; joinDate: Date; leaveDate: Date | null },
    ],
  ): Map<string, number> {
    const timesSpentMap = new Map<string, number>();

    for (const joinLeaveLog of joinLeaveTimeline) {
      let time;

      if (joinLeaveLog.leaveDate) {
        time =
          joinLeaveLog.leaveDate.getTime() - joinLeaveLog.joinDate.getTime();
      } else {
        time = new Date().getTime() - joinLeaveLog.joinDate.getTime();
      }

      timesSpentMap.set(
        joinLeaveLog.userId,
        (timesSpentMap.get(joinLeaveLog.userId) || 0) + time,
      );
    }

    return timesSpentMap;
  }

  private async convertTimesSpentMapToTimeSpentDataArray(
    timesSpentMap: Map<string, number>,
  ): Promise<TimeSpentData[]> {
    const timeSpentDataArray = Array.from(timesSpentMap.entries()).map(
      async ([userId, timeSpent]) => {
        const user = await this.usersService.findUserById(userId);
        return {
          timeSpent,
          email: user.email,
        } as TimeSpentData;
      },
    );

    return await Promise.all(timeSpentDataArray);
  }

  async getTimesSpentOnBoardInMs(boardId: string): Promise<TimeSpentData[]> {
    const boardStats = await this.boardStatsModel.findOne({ boardId });

    if (!boardStats) {
      throw new HttpException(
        `Stats not found for the given boardID: ${boardId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const timesSpentMap = this.getTimesSpentMap(boardStats.joinLeaveTimeline);

    return this.convertTimesSpentMapToTimeSpentDataArray(timesSpentMap);
  }
}
