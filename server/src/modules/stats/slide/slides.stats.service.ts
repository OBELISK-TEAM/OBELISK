import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SlideStats } from 'src/mongo/schemas/stats/slide.stats.schema';
import { SlideAction } from 'src/shared/enums/actions/slide.action';

@Injectable()
export class SlideStatsService {
  constructor(
    @InjectModel(SlideStats.name)
    private readonly slideStatsModel: Model<SlideStats>,
  ) {}

  async initStats(
    slideId: string,
    boardId: string,
    ownerId: string,
  ): Promise<void> {
    await this.slideStatsModel.create({ slideId, boardId, ownerId });
    void this.logAction(slideId, ownerId, null, null, SlideAction.ADD_SLIDE);
  }

  async removeStats(
    slideId: string | null,
    boardId: string | null,
  ): Promise<void> {
    if (!slideId && !boardId) return;

    const query: Record<string, string> = {};
    if (slideId) query.slideId = slideId;
    if (boardId) query.boardId = boardId;

    await this.slideStatsModel.deleteMany(query);
  }

  async logJoin(slideId: string, userId: string): Promise<void> {
    await this.slideStatsModel.updateOne(
      { slideId },
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
    void this.logAction(
      slideId,
      userId,
      null,
      null,
      SlideAction.USER_JOIN_SLIDE,
    );
  }

  async logLeave(slideId: string, userId: string): Promise<void> {
    await this.slideStatsModel.updateOne(
      {
        slideId,
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
    void this.logAction(
      slideId,
      userId,
      null,
      null,
      SlideAction.USER_LEAVE_SLIDE,
    );
  }

  async logAction(
    slideId: string,
    userId: string,
    top: number | null,
    left: number | null,
    action: SlideAction,
  ): Promise<void> {
    await this.slideStatsModel.updateOne(
      { slideId },
      {
        $push: {
          actionTimeline: {
            timestamp: new Date(),
            userId,
            top,
            left,
            action,
          },
        },
      },
    );
  }
}
