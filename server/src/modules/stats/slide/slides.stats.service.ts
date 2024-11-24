import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SlideStats } from 'src/modules/mongo/schemas/stats/slide.stats.schema';
import { SlideAction } from 'src/shared/enums/actions/slide.action';
import { HeatmapPoint } from 'src/shared/interfaces/stats/HeatmapPoint';

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

  async getActionsHeatmapData(
    slideId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HeatmapPoint[]> {
    if (startDate.toString() === 'Invalid Date') startDate = new Date(0);
    if (endDate.toString() === 'Invalid Date') endDate = new Date();

    if (startDate >= endDate)
      throw new HttpException('Inavlid dates', HttpStatus.BAD_REQUEST);

    const slideStats = await this.slideStatsModel.findOne({
      slideId,
      'actionTimeline.timestamp': { $gte: startDate, $lte: endDate },
    });

    if (!slideStats || !slideStats.actionTimeline) return [];

    const heatmapPoints: HeatmapPoint[] = slideStats.actionTimeline
      .filter(action => action.top && action.left)
      .map(action => ({
        top: action.top || 0,
        left: action.left || 0,
      }));

    return heatmapPoints;
  }
}
