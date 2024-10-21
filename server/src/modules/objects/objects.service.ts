import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SuperBoardDocument } from '../../mongo/schemas/board/super.board.schema';
import {
  SuperObject,
  SuperObjectDocument,
} from '../../mongo/schemas/object/super.object.schema';
import { ObjectResponseObject } from 'src/shared/interfaces/response-objects/ObjectResponseObject';
import { ObjectProps } from './objects.dto';
import { SuperSlideDocument } from '../../mongo/schemas/slide/super.slide.schema';
import { ResponseService } from '../response/response.service';
import { SlidesService } from '../slides/slides.service';
import { ObjectStatsService } from '../stats/object/object.stats.service';
import { ObjectAction } from 'src/shared/enums/actions/object.action';

@Injectable()
export class ObjectsService {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly res: ResponseService,
    private readonly objectStatsService: ObjectStatsService,
  ) {}

  async getObject(
    boardId: string,
    slideId: string,
    objectId: string,
  ): Promise<ObjectResponseObject> {
    const { object } = await this.findObjectById(boardId, slideId, objectId);
    return this.res.toResponseObject(object);
  }

  async createObject(
    boardId: string,
    slideId: string,
    creatorId: string,
    objectProps: ObjectProps,
  ): Promise<ObjectResponseObject> {
    const { board, slide } = await this.slidesService.findSlideById(
      boardId,
      slideId,
    );
    const newObject = new SuperObject({ ...objectProps });
    slide.objects.push(newObject as SuperObjectDocument);
    await board.save();
    const newObjectDocument = slide.objects.slice(-1)[0];

    await this.objectStatsService.initStats(
      newObjectDocument._id as string,
      boardId,
      slideId,
      creatorId,
    );

    return this.res.toResponseObject(newObjectDocument);
  }

  async updateObject(
    boardId: string,
    slideId: string,
    objectId: string,
    editorId: string,
    objectProps: ObjectProps,
  ): Promise<ObjectResponseObject> {
    const { board, object } = await this.findObjectById(
      boardId,
      slideId,
      objectId,
    );
    Object.assign(object, objectProps);
    await board.save();
    await this.objectStatsService.changeLastInteraction(
      objectId,
      editorId,
      this.determineObjectActionAfterUpdate(object, objectProps),
    );
    return this.res.toResponseObject(object);
  }

  async deleteObject(
    boardId: string,
    slideId: string,
    objectId: string,
  ): Promise<ObjectResponseObject> {
    const { board, slide, object } = await this.findObjectById(
      boardId,
      slideId,
      objectId,
    );
    const index = slide.objects.indexOf(object);
    const deletedObject = slide.objects.splice(index, 1)[0];
    await board.save();
    return this.res.toResponseObject(deletedObject);
  }

  private async findObjectById(
    boardId: string,
    slideId: string,
    objectId: string,
  ): Promise<{
    board: SuperBoardDocument;
    slide: SuperSlideDocument;
    object: SuperObjectDocument;
  }> {
    const { board, slide } = await this.slidesService.findSlideById(
      boardId,
      slideId,
    );
    const object = slide.objects.find(
      (obj: SuperObjectDocument & { _id: string }) =>
        obj._id.toString() === objectId,
    );
    if (!object) {
      throw new HttpException('Object not found', HttpStatus.NOT_FOUND);
    }
    return { board, slide, object };
  }

  private determineObjectActionAfterUpdate(
    oldObject: SuperObjectDocument,
    newObject: ObjectProps,
  ): ObjectAction {
    // TODO implement
    if (oldObject != newObject) {
      return ObjectAction.EDIT_OBJECT;
    }
    return ObjectAction.EDIT_OBJECT;
  }
}
