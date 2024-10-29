import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperObjectDocument } from 'src/mongo/schemas/object/super.object.schema';
import { ObjectStats } from 'src/mongo/schemas/stats/object.stats.schema';
import { ObjectAction } from 'src/shared/enums/actions/object.action';

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
    await this.changeLastInteraction(objectId, creatorId, null, null);
  }

  async removeStats(objectId: string): Promise<void> {
    await this.objectStatsModel.findOneAndDelete({ objectId });
  }

  async changeLastInteraction(
    objectId: string,
    userId: string,
    oldObject: SuperObjectDocument | null,
    newObject: SuperObjectDocument | null,
  ): Promise<void> {
    await this.objectStatsModel.findOneAndUpdate(
      { objectId },
      {
        $set: {
          lastInteraction: {
            userId,
            timestamp: new Date(),
            action: this.determineObjectAction(oldObject, newObject),
          },
        },
      },
    );
  }

  private determineObjectAction(
    oldObject: SuperObjectDocument | null,
    newObject: SuperObjectDocument | null,
  ): ObjectAction {
    if (oldObject === newObject) {
      return ObjectAction.ADD_OBJECT;
    }
    return ObjectAction.EDIT_OBJECT;
  }
}
