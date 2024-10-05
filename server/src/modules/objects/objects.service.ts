import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SuperBoardDocument } from '../../schemas/board/super.board.schema';
import {
  SuperObject,
  SuperObjectDocument,
} from '../../schemas/object/super.object.schema';
import { ObjectResponseObject } from 'src/shared/interfaces/response-objects/ObjectResponseObject';
import { CreateObjectDto } from './objects.dto';
import { SuperSlideDocument } from '../../schemas/slide/super.slide.schema';
import { ResponseService } from '../response/response.service';
import { SlidesService } from '../slides/slides.service';

@Injectable()
export class ObjectsService {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly res: ResponseService,
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
    objectProps: CreateObjectDto,
  ): Promise<ObjectResponseObject> {
    const { board, slide } = await this.slidesService.findSlideById(
      boardId,
      slideId,
    );
    const newObject = new SuperObject({ ...objectProps });
    slide.objects.push(newObject as SuperObjectDocument);
    await board.save();
    return this.res.toResponseObject(slide.objects.slice(-1)[0]);
  }

  async updateObject(
    boardId: string,
    slideId: string,
    objectId: string,
    objectProps: CreateObjectDto,
  ): Promise<ObjectResponseObject> {
    const { board, object } = await this.findObjectById(
      boardId,
      slideId,
      objectId,
    );
    Object.assign(object, objectProps);
    await board.save();
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
}
