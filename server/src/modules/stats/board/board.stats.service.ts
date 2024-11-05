import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardStats } from 'src/mongo/schemas/stats/board.stats.schema';
import { BoardAction } from 'src/shared/enums/actions/board.action';
import { BoardPermission } from 'src/shared/enums/board.permission';

@Injectable()
export class BoardStatsService {
  constructor(
    @InjectModel(BoardStats.name)
    private readonly boardStatsModel: Model<BoardStats>,
  ) {}

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
}
