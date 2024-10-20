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
  }

  async removeStats(slideId: string): Promise<void> {
    await this.slideStatsModel.findOneAndDelete({ slideId });
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
  }

  async logLeave(slideId: string, userId: string): Promise<void> {
    await this.slideStatsModel.updateOne(
      {
        slideId,
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

  async logEdit(
    slideId: string,
    userId: string,
    x: number,
    y: number,
    action: SlideAction,
  ): Promise<void> {
    await this.slideStatsModel.updateOne(
      { slideId },
      {
        $push: {
          editTimeline: {
            timestamp: new Date(),
            userId,
            x,
            y,
            action,
          },
        },
      },
    );
  }
}
