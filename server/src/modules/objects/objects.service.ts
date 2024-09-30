import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import {
  SuperObject,
  SuperObjectDocument,
} from '../../schemas/object/super.object.schema';
import { SlideObjectResponseObject } from 'src/shared/interfaces/response-objects/SlideObjectResponseObject';
import { WsException } from '@nestjs/websockets';
import { CreateSlideObject, UpdateSlideObject } from './objects.dto';

@Injectable()
export class ObjectsService {
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
  ) {}

  async createObject(
    boardId: string,
    slideId: string,
    objectProps: CreateSlideObject,
  ): Promise<SlideObjectResponseObject> {
    const newObject = new SuperObject({ ...objectProps });

    const updatedBoard = await this.boardModel.findOneAndUpdate(
      { _id: boardId, 'slides._id': slideId },
      { $push: { 'slides.$.objects': newObject } },
      { new: true },
    );

    if (!updatedBoard) {
      throw new WsException('Board or Slide not found');
    }

    return this.toResponseObject(this.getObjectFromBoard(updatedBoard));
  }

  async updateObject(
    boardId: string,
    slideId: string,
    objectId: string,
    objectProps: UpdateSlideObject,
  ): Promise<SlideObjectResponseObject> {
    const updatedBoard = await this.boardModel.findOneAndUpdate(
      { _id: boardId, 'slides._id': slideId, 'slides.objects._id': objectId },
      { $set: { 'slides.$.objects': objectProps } },
      { new: true },
    );

    if (!updatedBoard) {
      throw new WsException('Board or Slide not found');
    }

    return this.toResponseObject(this.getObjectFromBoard(updatedBoard));
  }

  async deleteObject(
    boardId: string,
    slideId: string,
    objectId: string,
  ): Promise<SlideObjectResponseObject> {
    const board = await this.boardModel.findOne(
      { _id: boardId, 'slides._id': slideId },
      { 'slides.$': 1 },
    );

    if (!board || !board.slides.length) {
      throw new WsException('Board or Slide not found');
    }

    const slide = board.slides[0];

    const objectToDelete = slide.objects.find(
      (obj: SuperObjectDocument & {_id: string}) => obj._id.toString() === objectId,
    );

    if (!objectToDelete) {
      throw new WsException('Object not found');
    }

    await this.boardModel.updateOne(
      { _id: boardId, 'slides._id': slideId },
      { $pull: { 'slides.$.objects': { _id: objectId } } },
    );

    return this.toResponseObject(objectToDelete as SuperObjectDocument);
  }

  private getObjectFromBoard(board: SuperBoardDocument): SuperObjectDocument {
    return board.slides[0].objects.slice(-1)[0] as SuperObjectDocument;
  }

  private toResponseObject(
    slideObject: SuperObjectDocument,
  ): SlideObjectResponseObject {
    const { _id, createdAt, updatedAt, ...objectProperties } =
      slideObject.toObject() as SuperObjectDocument;
    return {
      _id: _id as string,
      ...objectProperties,
    };
  }
}
