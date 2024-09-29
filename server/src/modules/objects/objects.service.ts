import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperBoard } from '../../schemas/board/super.board.schema';
import { SuperObject } from '../../schemas/object/super.object.schema';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
  ) {}

  async createObject(
    boardId: string,
    slideId: string,
    objectProps: any,
  ): Promise<any> {
    const newObject = new SuperObject({ ...objectProps });
    console.log(newObject);
    return this.boardModel.findOneAndUpdate(
      { _id: boardId, 'slides._id': slideId },
      { $push: { 'slides.$.objects': newObject } },
      { new: true },
    );
  }

  async updateObject(
    boardId: string,
    slideId: string,
    objectId: string,
    objectProps: any,
  ): Promise<any> {
    return this.boardModel.findOneAndUpdate(
      { _id: boardId, 'slides._id': slideId, 'slides.objects._id': objectId },
      { $set: { 'slides.$.objects.$': objectProps } },
      { new: true },
    );
  }

  async deleteObject(
    boardId: string,
    slideId: string,
    objectId: string,
  ): Promise<any> {
    return this.boardModel.findOneAndUpdate(
      { _id: boardId, 'slides._id': slideId },
      { $pull: { 'slides.$.objects': { _id: objectId } } },
      { new: true },
    );
  }
}
