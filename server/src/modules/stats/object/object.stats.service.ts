import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectStats } from 'src/mongo/schemas/stats/object.stats.schema';

@Injectable()
export class ObjectStatsService {
  constructor(
    @InjectModel(ObjectStats.name)
    private readonly objectStatsModel: Model<ObjectStats>,
  ) {}

  async initStats(
    objectId: string,
    boardId: string,
    slideId: string,
    creatorId: string,
  ): Promise<void> {
    await this.objectStatsModel.create({
      objectId,
      boardId,
      slideId,
      creatorId,
    });
  }

  async removeStats(objectId: string): Promise<void> {
    await this.objectStatsModel.findOneAndDelete({ objectId });
  }

  async changeLastInteraction(
    objectId: string,
    userId: string,
    actionType: string,
  ): Promise<void> {
    await this.objectStatsModel.updateOne(
      { objectId },
      {
        $set: {
          lastInteraction: {
            userId,
            timestamp: new Date(),
            actionType,
          },
        },
      },
    );
  }
}
