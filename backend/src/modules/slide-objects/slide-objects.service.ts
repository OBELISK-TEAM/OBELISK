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
    createSlideObjectDto: CreateSlideObjectDto,
  ): Promise<SlideObjectDocument> {
    const { createdById, slideId } = createSlideObjectDto;
    const createdSlideObject = new this.slideObjectModel(createSlideObjectDto);

    await this.userService.addSlideObject(createdById, createdSlideObject);
    await this.slideService.addSlideObject(slideId, createdSlideObject);

    return createdSlideObject.save();
  }

  async update(
    slideObjectId: string,
    updateSlideObjectDto: UpdateSlideObjectDto,
  ): Promise<SlideObjectDocument> {
    const existingSlideObject = await this.slideObjectModel
      .findByIdAndUpdate(slideObjectId, updateSlideObjectDto, { new: true })
      .exec();

    if (!existingSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);

    return existingSlideObject;
  }

  async delete(slideObjectId: string): Promise<SlideObjectDocument> {
    const existingslideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();

    if (!existingslideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);

    return existingslideObject;
  }
}
