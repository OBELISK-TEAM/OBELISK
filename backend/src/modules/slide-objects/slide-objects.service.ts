import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSlideObjectDto } from './slide-objects.dto';
import {
  SlideObject,
  SlideObjectDocument,
} from 'src/schemas/slide-object.schema';
import { UsersService } from '../users/users.service';
import { SlidesService } from '../slides/slides.service';
import { SlideObjectResponseObject } from '../../shared/interfaces/response-objects/SlideObjectResponseObject';

@Injectable()
export class SlideObjectsService {
  private readonly pageSize = 3;
  constructor(
    @InjectModel(SlideObject.name)
    private readonly slideObjectModel: Model<SlideObject>,
    private readonly userService: UsersService,
    private readonly slideService: SlidesService,
  ) {}

  async getSlideObjects(
    page: number = 1,
  ): Promise<SlideObjectResponseObject[]> {
    const skip = (page - 1) * this.pageSize;
    return this.findSlideObjects(skip, this.pageSize).then(slideObjects =>
      Promise.all(
        slideObjects.map(slideObject =>
          this.toResponseSlideObject(slideObject),
        ),
      ),
    );
  }

  async getSlideObjectById(
    slideObjectId: string,
  ): Promise<SlideObjectResponseObject> {
    return this.findOneById(slideObjectId).then(slideObject =>
      this.toResponseSlideObject(slideObject, true, true),
    );
  }

  // TODO - check permissions before creating (for edit) - there is a method in boards.service
  async createSlideObject(
    userId: string,
    createSlideObjectDto: CreateSlideObjectDto,
  ): Promise<SlideObjectResponseObject> {
    const { slideId, ...slideObject } = createSlideObjectDto;
    const slide = await this.slideService.findSlideById(slideId);
    const user = await this.userService.findUserById(userId);
    const createdSlideObject = new this.slideObjectModel({
      ...slideObject,
      createdBy: user,
      slide,
    });
    await this.userService.addSlideObjectToUser(userId, createdSlideObject);
    await this.slideService.addSlideObjectToSlide(slideId, createdSlideObject);
    return createdSlideObject
      .save()
      .then(slideObject => this.toResponseSlideObject(slideObject));
  }

  // TODO - again - check user-board permissions
  async updateSlideObject(
    userId: string,
    slideObjectId: string,
    updateSlideObjectDto: CreateSlideObjectDto,
  ): Promise<SlideObjectResponseObject> {
    const { slideId, ...updatedSlideObjectProperties } = updateSlideObjectDto;
    const updatedSlideObject = await this.slideObjectModel
      .findByIdAndUpdate(slideObjectId, updatedSlideObjectProperties, {
        new: true,
      })
      .exec();
    if (!updatedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return this.toResponseSlideObject(updatedSlideObject);
  }

  // TODO - here also
  async deleteSlideObject(
    userId: string,
    slideObjectId: string,
  ): Promise<SlideObjectResponseObject> {
    const slideObject = await this.findOneById(slideObjectId);
    await this.slideService.deleteSlideObjectFromSlide(
      slideObjectId,
      slideObject.slide,
    );
    await this.userService.deleteSlideObjectFromUser(userId, slideObjectId);
    return this.deleteSlideObjectById(slideObjectId).then(deletedSlideObject =>
      this.toResponseSlideObject(deletedSlideObject),
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////

  async findSlideObjects(
    skip: number,
    limit: number,
  ): Promise<SlideObjectDocument[]> {
    return this.slideObjectModel.find().skip(skip).limit(limit).exec();
  }

  async findOneById(slideObjectId: string): Promise<SlideObjectDocument> {
    const existingSlideObject = await this.slideObjectModel
      .findById(slideObjectId)
      .exec();
    if (!existingSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return existingSlideObject;
  }

  async deleteSlideObjectById(
    slideObjectId: string,
  ): Promise<SlideObjectDocument> {
    const deletedSlideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();
    if (!deletedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return deletedSlideObject;
  }

  toResponseSlideObject(
    slideObject: SlideObjectDocument,
    showSlide: boolean = false,
    showCreatedBy: boolean = false,
    showTimestamps: boolean = false,
  ): SlideObjectResponseObject {
    const { _id, slide, createdBy, createdAt, updatedAt, ...objectProperties } =
      slideObject.toObject() as SlideObjectDocument;
    const responseObject: SlideObjectResponseObject = {
      _id: _id as string,
      ...objectProperties,
    };

    if (showSlide) responseObject.slide = slide;
    if (showCreatedBy) responseObject.createdBy = createdBy;
    if (showTimestamps) {
      responseObject.createdAt = createdAt;
      responseObject.updatedAt = updatedAt;
    }

    return responseObject;
  }
}
