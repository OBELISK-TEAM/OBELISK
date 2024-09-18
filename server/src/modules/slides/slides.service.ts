import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide, SlideDocument } from '../../schemas/slide.schema';
import { CreateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import { BoardDocument } from '../../schemas/board.schema';
import { SlideObject } from 'src/schemas/slide-object.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { UsersService } from '../users/users.service';
import { BoardPermission } from '../../enums/board.permission';

@Injectable()
export class SlidesService {
  private readonly pageSize = 5;
  private readonly slidesLimitPerBoard = 10;
  constructor(
    @InjectModel(Slide.name) private readonly slideModel: Model<Slide>,
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

  async deleteSlide(
    userId: string,
    slideId: string,
  ): Promise<SlideResponseObject> {
    const slide = await this.findSlideById(slideId);
    const user = await this.usersService.findUserById(userId);
    const board = await this.boardsService.findBoardById(slide.board);
    this.boardsService.verifyBoardPermission(
      board,
      user,
      BoardPermission.EDITOR,
    );
    await this.boardsService.deleteSlideFromBoard(slide.board, slideId);
    return this.deleteSlideById(slideId).then(slide =>
      this.toResponseSlide(slide),
    );
  }

  async findSlides(skip: number, limit: number): Promise<SlideDocument[]> {
    return this.slideModel.find().skip(skip).limit(limit).exec();
  }

  async findSlideById(slideId: string): Promise<SlideDocument> {
    const existingSlide = await this.slideModel.findById(slideId).exec();
    if (!existingSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return existingSlide;
  }

  async createNewSlide(slide: CreateSlideDto): Promise<SlideDocument> {
    const { boardId, ...rest } = slide;
    const createdSlide = new this.slideModel({
      ...rest,
      board: boardId,
    });
    return createdSlide.save();
  }

  async deleteSlideById(slideId: string): Promise<SlideDocument> {
    const deletedSlide = await this.slideModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!deletedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return deletedSlide;
  }

  async addSlideObjectToSlide(
    slideId: string,
    slideObject: SlideObject,
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
    if (!updatedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
  }

  private validateSlidesLimit(board: BoardDocument): void {
    const slidesCount = board.slides.length;
    if (slidesCount >= this.slidesLimitPerBoard)
      throw new HttpException('Slides limit reached', HttpStatus.BAD_REQUEST);
  }

  private async toResponseSlide(
    slide: SlideDocument,
    showBoard: boolean = false,
    showObjects: boolean = false,
    showTimestamps: boolean = false,
  ): Promise<SlideResponseObject> {
    const { _id, board, objects } = slide.toObject() as SlideDocument;
    const responseObject: SlideResponseObject = { _id: _id as string };

    if (showBoard) {
      await slide.populate('board');
      responseObject.board = await this.boardsService.toResponseBoard(
        board as unknown as BoardDocument,
      );
    }

    if (showObjects) {
      await slide.populate('objects');
      responseObject.objects = objects;
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