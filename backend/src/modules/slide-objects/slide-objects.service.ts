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

  // TODO - adding only if user has board permissions
  async create(
    userId: string,
    createSlideObjectDto: CreateSlideObjectDto,
  ): Promise<any> {
    const { slideId, ...slideObject } = createSlideObjectDto;

    const slide = await this.slideService.findOneById(slideId);
    // const board = await this.boardService.findOneById(slide.board._id);
    // const user = await this.userService.findOneById(slide.board.owner);
    console.log(slide);
    // const createdSlideObject = new this.slideObjectModel(slideObject);
    // await this.userService.addSlideObjectToUser(userId, createdSlideObject);
    // await this.slideService.addSlideObject(slideId, createdSlideObject);
    // return createdSlideObject.save();
  }

  async update(
    userId: string,
    slideObjectId: string,
    updateSlideObjectDto: UpdateSlideObjectDto,
  ): Promise<SlideObjectDocument> {
    const updatedSlideObject = await this.slideObjectModel
      .findByIdAndUpdate(slideObjectId, updateSlideObjectDto, { new: true })
      .exec();
    if (!updatedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return updatedSlideObject;
  }

  async delete(
    userId: string,
    slideObjectId: string,
  ): Promise<SlideObjectDocument> {
    const deletedSlideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();
    if (!deletedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return deletedSlideObject;
  }
}
