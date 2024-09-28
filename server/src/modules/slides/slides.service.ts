import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SuperSlide,
  SuperSlideDocument,
} from '../../schemas/slide/super.slide.schema';
import { CreateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import { SuperBoardDocument } from '../../schemas/board/super.board.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { UsersService } from '../users/users.service';
import { BoardPermission } from '../../enums/board.permission';
import { SuperObject } from '../../schemas/object/super.object.schema';

@Injectable()
export class SlidesService {
  private readonly pageSize = 5;
  private readonly slidesLimitPerBoard = 10;
  constructor(
    @InjectModel(SuperSlide.name)
    private readonly slideModel: Model<SuperSlide>,
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService,
  ) {}

  async getSlides(page: number = 1): Promise<SlideResponseObject[]> {
    const skip = (page - 1) * this.pageSize;
    return this.findSlides(skip, this.pageSize).then(slides =>
      Promise.all(slides.map(slide => this.toResponseSlide(slide))),
    );
  }

  async getSlideById(slideId: string): Promise<SlideResponseObject> {
    return this.findSlideById(slideId).then(slide =>
      this.toResponseSlide(slide),
    );
  }

  async createSlide(
    userId: string,
    createSlideDto: CreateSlideDto,
  ): Promise<SlideResponseObject> {
    const { boardId } = createSlideDto;
    const user = await this.usersService.findUserById(userId);
    const board = await this.boardsService.findBoardById(boardId);
    this.boardsService.verifyBoardPermission(
      board,
      user,
      BoardPermission.EDITOR,
    );
    this.validateSlidesLimit(board);
    const createdSlide = await this.createNewSlide(createSlideDto);
    await this.boardsService.addSlideToBoard(
      boardId,
      createdSlide._id as string,
    );
    return createdSlide.save().then(slide => this.toResponseSlide(slide));
  }

  // async deleteSlide(
  //   userId: string,
  //   slideId: string,
  // ): Promise<SlideResponseObject> {
  //   const slide = await this.findSlideById(slideId);
  //   const user = await this.usersService.findUserById(userId);
  //   const board = await this.boardsService.findBoardById(slide.board);
  //   this.boardsService.verifyBoardPermission(
  //     board,
  //     user,
  //     BoardPermission.EDITOR,
  //   );
  //   await this.boardsService.deleteSlideFromBoard(slide.board, slideId);
  //   return this.deleteSlideById(slideId).then(slide =>
  //     this.toResponseSlide(slide),
  //   );
  // }

  async findSlides(skip: number, limit: number): Promise<SuperSlideDocument[]> {
    return this.slideModel.find().skip(skip).limit(limit).exec();
  }

  async findSlideById(slideId: string): Promise<SuperSlideDocument> {
    const existingSlide = await this.slideModel.findById(slideId).exec();
    if (!existingSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return existingSlide;
  }

  async createNewSlide(slide: CreateSlideDto): Promise<SuperSlideDocument> {
    const { boardId, ...rest } = slide;
    const createdSlide = new this.slideModel({
      ...rest,
      board: boardId,
    });
    return createdSlide.save();
  }

  async deleteSlideById(slideId: string): Promise<SuperSlideDocument> {
    const deletedSlide = await this.slideModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!deletedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return deletedSlide;
  }

  async addSlideObjectToSlide(
    slideId: string,
    slideObject: SuperObject,
  ): Promise<void> {
    const updatedSlide = await this.slideModel
      .findByIdAndUpdate(
        slideId,
        { $push: { objects: slideObject } },
        { new: true },
      )
      .exec();
    if (!updatedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
  }

  // not working or sth?
  async deleteSlideObjectFromSlide(
    slideId: string,
    slideObjectId: string,
  ): Promise<void> {
    const updatedSlide = await this.slideModel
      .findByIdAndUpdate(
        slideId,
        { $pull: { objects: { _id: slideObjectId } } },
        { new: true },
      )
      .exec();
    console.log(updatedSlide);
    if (!updatedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
  }

  async deleteObjectFromSlide(
    slideId: string,
    objectId: string,
  ): Promise<void> {
    const updatedSlide = await this.slideModel
      .findByIdAndUpdate(
        slideId,
        { $pull: { objects: objectId } },
        { new: true },
      )
      .exec();
    if (!updatedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
  }

  private validateSlidesLimit(board: SuperBoardDocument): void {
    const slidesCount = board.slides.length;
    if (slidesCount >= this.slidesLimitPerBoard)
      throw new HttpException('Slides limit reached', HttpStatus.BAD_REQUEST);
  }

  private async toResponseSlide(
    slide: SuperSlideDocument,
    showBoard: boolean = false,
    showObjects: boolean = false,
    showTimestamps: boolean = false,
  ): Promise<SlideResponseObject> {
    const { _id, objects } = slide.toObject() as SuperSlideDocument;
    const responseObject: SlideResponseObject = { _id: _id as string };

    if (showObjects) {
      await slide.populate('objects');
      // responseObject.objects = objects;
      // responseObject.objects = await Promise.all(
      //   objects.map(object =>
      //     this.slideObjectsService.toResponseSlideObject(
      //       object as unknown as SlideObjectDocument,
      //     ),
      //   ),
      // );
    }

    if (showTimestamps) {
      responseObject.createdAt = slide.createdAt;
      responseObject.updatedAt = slide.updatedAt;
    }

    return responseObject;
  }
}
