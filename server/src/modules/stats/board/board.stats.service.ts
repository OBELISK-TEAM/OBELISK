import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardStats } from 'src/schemas/stats/board.stats.schema';

@Injectable()
export class BoardStatsService {
  constructor(
    @InjectModel(BoardStats.name)
    private readonly boardStatsModel: Model<BoardStats>,
  ) {}

  async initStats(boardId: string, ownerId: string): Promise<void> {
    await this.boardStatsModel.create({ boardId, ownerId });
  }

  async removeStats(boardId: string): Promise<void> {
    await this.boardStatsModel.findOneAndDelete({ boardId });
  }

  async updateLastAccessed(boardId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      { $set: { lastAccessedAt: new Date() } },
    );
  }

  async logView(boardId: string, userId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          viewTimeline: {
            timestamp: new Date(),
            userId,
          },
        },
      },
    );
  }

  async logShare(boardId: string, userId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          shareTimeline: {
            timestamp: new Date(),
            userId,
          },
        },
      },
    );
  }

  async logEdit(boardId: string, userId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          editTimeline: {
            timestamp: new Date(),
            userId,
          },
        },
      },
    );
  }

  async updateActiveUsers(boardId: string, diff: number): Promise<void> {
    let newUsersCount;
    const boardStats = await this.boardStatsModel.findOne({ boardId }).exec();

    if (!boardStats) return;

    const activeUsersTimelineLength = boardStats.activeUsersTimeline.length;

    if (!activeUsersTimelineLength && diff > 0) {
      newUsersCount = diff;
    } else if (boardStats.activeUsersTimeline.length) {
      newUsersCount =
        boardStats.activeUsersTimeline[activeUsersTimelineLength - 1]
          .usersCount + diff;
    }

    if (newUsersCount) {
      await this.boardStatsModel.updateOne(
        { boardId },
        {
          $push: {
            activeUsersTimeline: {
              timestamp: new Date(),
              usersCount: newUsersCount > 0 ? newUsersCount : 0,
            },
          },
        },
      );
    }
  }

  async resetActiveUsers(boardId: string): Promise<void> {
    const boardStats = await this.boardStatsModel.findOne({ boardId }).exec();

    if (!boardStats) return;

    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          activeUsersTimeline: { timestamp: new Date(), usersCount: 0 },
        },
      },
    );
  }

  async logUserJoinBoard(
    boardId: string,
    userId: string,
    startDate: Date,
  ): Promise<void> {
    await this.boardStatsModel.updateOne(
      { boardId },
      {
        $push: {
          timeSpent: {
            userId,
            startDate,
            endDate: null,
          },
        },
      },
    );
  }

  async logUserLeaveBoard(
    boardId: string,
    userId: string,
    endDate: Date,
  ): Promise<void> {
    await this.boardStatsModel.updateOne(
      {
        boardId,
        'timeSpend.userId': userId,
        'timeSpend.endDate': null,
      },
      {
        $set: {
          'timeSpend.$.endDate': endDate,
        },
      },
    );
  }
}
