import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BoardStats } from 'src/mongo/schemas/stats/board.stats.schema';

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
  }

  async logLeave(boardId: string, userId: string): Promise<void> {
    await this.boardStatsModel.updateOne(
      {
        boardId,
        'joinLeaveTimeline.userId': userId,
        'joinLeaveTimeline.leaveDate': null,
      },
      {
        $set: {
          'joinLeaveTimeline.$.leaveDate': new Date(),
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
}
