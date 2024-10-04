import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SlideObject,
  SlideObjectDocument,
} from 'src/schemas/slide-object.schema';
import { UsersService } from '../users/users.service';
import { SlidesService } from '../slides/slides.service';
import { SlideObjectResponseObject } from '../../shared/interfaces/response-objects/SlideObjectResponseObject';
import {
  ObjectDataProps,
  ObjectDataPropsWithId,
} from '../../gateway/gateway.dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsObjectsService {
  constructor(
    @InjectModel(SlideObject.name)
    private readonly slideObjectModel: Model<SlideObject>,
    private readonly usersService: UsersService,
    private readonly slidesService: SlidesService,
  ) {}

  async createObject(
    userId: string,
    slideId: string,
    objectProps: ObjectDataProps,
  ): Promise<SlideObjectResponseObject> {
    const slide = await this.slidesService.findSlideById(slideId);
    const user = await this.usersService.findUserById(userId);
    const createdSlideObject = new this.slideObjectModel({
      ...objectProps,
      createdBy: user,
      slide,
    });
    await this.usersService.addSlideObjectToUser(userId, createdSlideObject);
    await this.slidesService.addSlideObjectToSlide(slideId, createdSlideObject);
    return createdSlideObject
      .save()
      .then(slideObject => this.toResponseObject(slideObject));
  }

  async updateObject(
    object: ObjectDataPropsWithId,
  ): Promise<SlideObjectResponseObject> {
    const updatedSlideObject = await this.slideObjectModel
      .findByIdAndUpdate(object._id, object, { new: true })
      .exec();
    if (!updatedSlideObject) throw new WsException('Slide Object not found');
    return this.toResponseObject(updatedSlideObject);
  }

  async deleteObject(
    userId: string,
    slideId: string,
    slideObjectId: string,
  ): Promise<SlideObjectResponseObject> {
    await this.slidesService.findSlideById(slideId);
    await this.usersService.findUserById(userId);

    const deletedSlideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();
    if (!deletedSlideObject) throw new WsException('Slide Object not found');

    await this.usersService.deleteSlideObjectFromUser(
      userId,
      deletedSlideObject._id.toString(),
    );
    await this.slidesService.deleteObjectFromSlide(
      slideId,
      deletedSlideObject._id.toString(),
    );
    return this.toResponseObject(deletedSlideObject);
  }

  private toResponseObject(
    slideObject: SlideObjectDocument,
  ): SlideObjectResponseObject {
    const { _id, slide, createdBy, createdAt, updatedAt, ...objectProperties } =
      slideObject.toObject() as SlideObjectDocument;
    return {
      _id: _id as string,
      slide: slide,
      ...objectProperties,
    };
  }
}
