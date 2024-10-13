import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SlideStats } from 'src/schemas/stats/slide.stats.schema';

@Injectable()
export class SlideStatsService {
  constructor(
    @InjectModel(SlideStats.name)
    private readonly slideStatsModel: Model<SlideStats>,
  ) {}

  async initStats(slideId: string, ownerId: string): Promise<void> {
    await this.slideStatsModel.create({ slideId, ownerId });
  }

  async removeStats(slideId: string): Promise<void> {
    await this.slideStatsModel.findOneAndDelete({ slideId });
  }

  async logView(slideId: string, userId: string): Promise<void> {
    await this.slideStatsModel.updateOne(
      { slideId },
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

  async logEdit(
    slideId: string,
    userId: string,
    x: number,
    y: number,
    actionType: string,
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
            actionType,
          },
        },
      },
    );
  }

  async updateObjectsAdded(slideId: string, diff: number): Promise<void> {
    let newObjectsCount;
    const slideStats = await this.slideStatsModel.findOne({ slideId }).exec();

    if (!slideStats) return;

    const objectsAddedTimelineLength = slideStats.objectsAddedTimeline.length;

    if (!objectsAddedTimelineLength && diff > 0) {
      newObjectsCount = diff;
    } else if (objectsAddedTimelineLength) {
      newObjectsCount =
        slideStats.objectsAddedTimeline[objectsAddedTimelineLength - 1]
          .objectsCount + diff;
    }

    if (newObjectsCount) {
      await this.slideStatsModel.updateOne(
        { slideId },
        {
          $push: {
            objectsAddedTimeline: {
              timestamp: new Date(),
              objectsCount: newObjectsCount > 0 ? newObjectsCount : 0,
            },
          },
        },
      );
    }
  }

  async updateActiveUsers(slideId: string, diff: number): Promise<void> {
    let newUsersCount;
    const slideStats = await this.slideStatsModel.findOne({ slideId }).exec();

    if (!slideStats) return;

    const activeUsersTimelineLength = slideStats.activeUsersTimeline.length;

    if (!activeUsersTimelineLength && diff > 0) {
      newUsersCount = diff;
    } else if (activeUsersTimelineLength) {
      newUsersCount =
        slideStats.activeUsersTimeline[activeUsersTimelineLength - 1]
          .usersCount + diff;
    }

    if (newUsersCount) {
      await this.slideStatsModel.updateOne(
        { slideId },
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

  async resetActiveUsers(slideId: string): Promise<void> {
    const slideStats = await this.slideStatsModel.findOne({ slideId }).exec();

    if (!slideStats) return;

    await this.slideStatsModel.updateOne(
      { slideId },
      {
        $push: {
          activeUsersTimeline: { timestamp: new Date(), usersCount: 0 },
        },
      },
    );
  }

  async logUserJoinSlide(
    slideId: string,
    userId: string,
    startDate: Date,
  ): Promise<void> {
    await this.slideStatsModel.updateOne(
      { slideId },
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

  async logUserLeaveSlide(
    slideId: string,
    userId: string,
    endDate: Date,
  ): Promise<void> {
    await this.slideStatsModel.updateOne(
      {
        slideId,
        'timeSpent.userId': userId,
        'timeSpent.endDate': null,
      },
      {
        $set: {
          'timeSpent.$.endDate': endDate,
        },
      },
    );
  }
}
