import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateSlideObjectDto,
  UpdateSlideObjectDto,
} from './slide-objects.dto';
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

  async create(
    userId: string,
    createSlideObjectDto: Partial<CreateSlideObjectDto>,
  ): Promise<SlideObjectDocument> {
    const { slideId, ...slideObject } = createSlideObjectDto;
    if (!slideId)
      throw new HttpException('Slide ID is required', HttpStatus.BAD_REQUEST);

    const createdSlideObject = new this.slideObjectModel(slideObject);

    await this.userService.addSlideObject(userId, createdSlideObject);
    await this.slideService.addSlideObject(slideId, createdSlideObject);

    return createdSlideObject.save();
  }

  async update(
    userId: string,
    slideObjectId: string,
    updateSlideObjectDto: UpdateSlideObjectDto,
  ): Promise<SlideObjectDocument> {
    // I don't know if there is a point of checking existence of user
    // since there is middleware (guard) that checks if user exists
    // this comment refers to all the services
    const existingUser = await this.userService.findOneById(userId);
    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const existingSlideObject = await this.slideObjectModel
      .findByIdAndUpdate(slideObjectId, updateSlideObjectDto, { new: true })
      .exec();

    if (!existingSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);

    return existingSlideObject;
  }

  async delete(slideObjectId: string): Promise<SlideObjectDocument> {
    const existingSlideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();

    if (!existingSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);

    return existingSlideObject;
  }
}
