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

@Injectable()
export class SlideObjectsService {
  constructor(
    @InjectModel(SlideObject.name)
    private readonly slideObjectModel: Model<SlideObject>,
    private readonly userService: UsersService,
    private readonly slideService: SlidesService,
  ) {}

  async findAll(): Promise<SlideObjectDocument[]> {
    return this.slideObjectModel.find().exec();
  }

  async findOneById(slideObjectId: string): Promise<SlideObjectDocument> {
    const existingSlideObject = await this.slideObjectModel
      .findById(slideObjectId)
      .exec();
    if (!existingSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return existingSlideObject;
  }

  // TODO - check permissions before creating (for edit) - there is a method in boards.service
  async create(
    userId: string,
    createSlideObjectDto: CreateSlideObjectDto,
  ): Promise<SlideObjectDocument> {
    const { slideId, ...slideObject } = createSlideObjectDto;

    const slide = await this.slideService.findSlideById(slideId);
    const user = await this.userService.findUserById(userId);

    const createdSlideObject = new this.slideObjectModel({
      ...slideObject,
      createdBy: user,
      slide,
    });

    await this.userService.addSlideObjectToUser(userId, createdSlideObject);
    await this.slideService.addSlideObject(slideId, createdSlideObject);
    return createdSlideObject.save();
  }

  // TODO - again - check user-board permissions
  async update(
    userId: string,
    slideObjectId: string,
    updateSlideObjectDto: CreateSlideObjectDto,
  ): Promise<SlideObjectDocument> {
    const { slideId, ...slideObject } = updateSlideObjectDto;

    // const slide = await this.slideService.findOneById(slideId);
    // const user = await this.userService.findOneById(userId);

    const updatedSlideObject = await this.slideObjectModel
      .findByIdAndUpdate(slideObjectId, slideObject, { new: true })
      .exec();
    if (!updatedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return updatedSlideObject;
  }

  // TODO - here also
  async delete(
    userId: string,
    slideObjectId: string,
  ): Promise<SlideObjectDocument> {
    // const slide = await this.slideService.findOneById(slideId);
    // const user = await this.userService.findOneById(userId);

    const deletedSlideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();
    if (!deletedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return deletedSlideObject;
  }
}
