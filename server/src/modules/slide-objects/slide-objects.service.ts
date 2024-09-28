import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSlideObject } from './slide-objects.dto';
import {
  SuperObject,
  SuperObjectDocument,
} from 'src/schemas/object/super.object.schema';
import { UsersService } from '../users/users.service';
import { SlidesService } from '../slides/slides.service';
import { SlideObjectResponseObject } from '../../shared/interfaces/response-objects/SlideObjectResponseObject';
import { BoardsService } from '../boards/boards.service';
import { BoardPermission } from '../../enums/board.permission';

@Injectable()
export class SlideObjectsService {
  private readonly pageSize = 3;
  constructor(
    @InjectModel(SuperObject.name)
    private readonly slideObjectModel: Model<SuperObject>,
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService,
    private readonly slidesService: SlidesService,
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
    return this.findObjectById(slideObjectId).then(slideObject =>
      this.toResponseSlideObject(slideObject, true, true),
    );
  }

  // async createSlideObject(
  //   userId: string,
  //   createSlideObjectDto: CreateSlideObject,
  // ): Promise<SlideObjectResponseObject> {
  //   const { slideId, ...slideObject } = createSlideObjectDto;
  //   const slide = await this.slidesService.findSlideById(slideId);
  //   const user = await this.usersService.findUserById(userId);
  //   // const board = await this.boardsService.findBoardById(slide.board);
  //   // this.boardsService.verifyBoardPermission(
  //   //   board,
  //   //   user,
  //   //   BoardPermission.EDITOR,
  //   // );
  //   const createdSlideObject = new this.slideObjectModel({
  //     ...slideObject,
  //     createdBy: user,
  //     slide,
  //   });
  //   return createdSlideObject
  //     .save()
  //     .then(slideObject => this.toResponseSlideObject(slideObject));
  // }

  // async updateSlideObject(
  //   userId: string,
  //   slideObjectId: string,
  //   updateSlideObjectDto: CreateSlideObject,
  // ): Promise<SlideObjectResponseObject> {
  //   const { slideId, ...updatedSlideObjectProperties } = updateSlideObjectDto;
  //   const slide = await this.slidesService.findSlideById(slideId);
  //   const user = await this.usersService.findUserById(userId);
  //   // const board = await this.boardsService.findBoardById(slide.board);
  //   // this.boardsService.verifyBoardPermission(
  //   //   board,
  //   //   user,
  //   //   BoardPermission.EDITOR,
  //   // );
  //   const updatedSlideObject = await this.slideObjectModel
  //     .findByIdAndUpdate(slideObjectId, updatedSlideObjectProperties, {
  //       new: true,
  //     })
  //     .exec();
  //   if (!updatedSlideObject)
  //     throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
  //   return this.toResponseSlideObject(updatedSlideObject);
  // }

  async deleteSlideObject(
    userId: string,
    slideObjectId: string,
  ): Promise<SlideObjectResponseObject> {
    const slideObject = await this.findObjectById(slideObjectId);
    // const slide = await this.slidesService.findSlideById(slideObject.slide);
    const user = await this.usersService.findUserById(userId);
    // const board = await this.boardsService.findBoardById(slide.board);
    // this.boardsService.verifyBoardPermission(
    //   board,
    //   user,
    //   BoardPermission.EDITOR,
    // );
    // await this.slidesService.deleteSlideObjectFromSlide(
    //   slideObject.slide,
    //   slideObjectId,
    // );
    return this.deleteSlideObjectById(slideObjectId).then(deletedSlideObject =>
      this.toResponseSlideObject(deletedSlideObject),
    );
  }

  async findSlideObjects(
    skip: number,
    limit: number,
  ): Promise<SuperObjectDocument[]> {
    return this.slideObjectModel.find().skip(skip).limit(limit).exec();
  }

  async findObjectById(slideObjectId: string): Promise<SuperObjectDocument> {
    const existingSlideObject = await this.slideObjectModel
      .findById(slideObjectId)
      .exec();
    if (!existingSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return existingSlideObject;
  }

  async deleteSlideObjectById(
    slideObjectId: string,
  ): Promise<SuperObjectDocument> {
    const deletedSlideObject = await this.slideObjectModel
      .findByIdAndDelete(slideObjectId)
      .exec();
    if (!deletedSlideObject)
      throw new HttpException('Slide Object not found', HttpStatus.NOT_FOUND);
    return deletedSlideObject;
  }

  toResponseSlideObject(
    slideObject: SuperObjectDocument,
    showSlide: boolean = false,
    showCreatedBy: boolean = false,
    showTimestamps: boolean = false,
  ): SlideObjectResponseObject {
    const { _id, createdAt, updatedAt, ...objectProperties } =
      slideObject.toObject() as SuperObjectDocument;
    const responseObject: SlideObjectResponseObject = {
      _id: _id as string,
      ...objectProperties,
    };
    // if (showSlide) responseObject.slide = slide;
    // if (showCreatedBy) responseObject.createdBy = createdBy;
    if (showTimestamps) {
      responseObject.createdAt = createdAt;
      responseObject.updatedAt = updatedAt;
    }
    return responseObject;
  }
}
