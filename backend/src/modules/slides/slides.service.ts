import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide, SlideDocument } from '../../schemas/slide.schema';
import { CreateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import { BoardDocument } from '../../schemas/board.schema';
import { SlideObject } from 'src/schemas/slide-object.schema';
import { UsersService } from '../users/users.service';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';

// TODO https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id

@Injectable()
export class SlidesService {
  private readonly pageSize = 5;
  private readonly slidesLimitPerBoard = 10;
  constructor(
    @InjectModel(Slide.name) private readonly slideModel: Model<Slide>,
    private readonly boardsService: BoardsService,
    private readonly usersService: UsersService,
  ) {}

  async getSlides(page: number = 1): Promise<SlideResponseObject[]> {
    const skip = (page - 1) * this.pageSize;
    return this.findSlides(skip, this.pageSize).then(slides =>
      Promise.all(slides.map(slide => this.toResponseSlide(slide))),
    );
  }

  async getSlideById(slideId: string): Promise<SlideResponseObject> {
    return this.findSlideById(slideId, true).then(slide =>
      this.toResponseSlide(slide, true, true),
    );
  }

  async createSlide(
    userId: string,
    createSlideDto: CreateSlideDto,
  ): Promise<SlideResponseObject> {
    const { boardId, ...rest } = createSlideDto;
    // TODO - check permissions first
    const board = await this.boardsService.findBoardById(boardId);
    this.validateSlidesLimit(board);
    const createdSlide = new this.slideModel({ ...rest, board: board._id });
    await this.boardsService.addSlideToBoard(
      boardId,
      createdSlide._id.toString(),
    );
    return createdSlide.save().then(slide => this.toResponseSlide(slide));
  }

  async deleteSlide(
    userId: string,
    slideId: string,
  ): Promise<SlideResponseObject> {
    // TODO - check permissions first
    const slide = await this.findSlideById(slideId);
    await this.boardsService.deleteSlideFromBoard(slide.board, slideId);
    return this.deleteSlideById(slideId).then(slide =>
      this.toResponseSlide(slide),
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////

  async findSlides(skip: number, limit: number): Promise<SlideDocument[]> {
    return this.slideModel.find().skip(skip).limit(limit).exec();
  }

  async findSlideById(
    slideId: string,
    populateBoard: boolean = false,
  ): Promise<SlideDocument> {
    const query = this.slideModel.findById(slideId);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (populateBoard) query.populate('board');
    const existingSlide = await query.exec();
    if (!existingSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return existingSlide;
  }

  async deleteSlideById(slideId: string): Promise<SlideDocument> {
    const deletedSlide = await this.slideModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!deletedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return deletedSlide;
  }

  // TODO - check permissions first
  async addSlideObject(
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

  // TODO - check permissions first
  async deleteSlideObject(
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

  private toResponseSlide(
    slide: SlideDocument,
    showBoard: boolean = false,
    showObjects: boolean = false,
  ): SlideResponseObject {
    const { _id, objects, board } = slide;
    const responseObject: SlideResponseObject = { _id: _id as string };
    if (showBoard && typeof board === 'object') {
      responseObject.board = this.boardsService.toResponseBoard(board);
    } else responseObject.board = board;
    if (showObjects) responseObject.objects = objects;
    return responseObject;
  }
}
