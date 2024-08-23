import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide, SlideDocument } from '../../schemas/slide.schema';
import { CreateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import { BoardDocument } from '../../schemas/board.schema';
import { SlideObject } from 'src/schemas/slide-object.schema';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../../schemas/user.schema';

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

  async findAll(page: number = 1): Promise<SlideDocument[]> {
    const skip = (page - 1) * this.pageSize;
    return this.slideModel.find().skip(skip).limit(this.pageSize).exec();
  }

  async findOneById(slideId: string): Promise<SlideDocument> {
    const existingSlide = await this.slideModel.findById(slideId).exec();
    if (!existingSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return existingSlide;
  }

  async create(userId: string, createSlideDto: CreateSlideDto): Promise<any> {
    const { boardId, ...rest } = createSlideDto;

    const user = await this.usersService.findOneById(userId);
    const board = await this.boardsService.findOneById(boardId);

    // export to func
    // @ts-ignore
    const isOwner = board.owner.toString() === user._id.toString();
    const hasEditPermission = board.permissions.edit.some(
      // @ts-ignore
      id => id.toString() === user._id.toString(),
    );

    if (!isOwner && !hasEditPermission)
      throw new HttpException(
        'User does not have permission to create slides',
        HttpStatus.FORBIDDEN,
      );

    this.validateSlidesLimit(board);
    const createdSlide = new this.slideModel({ ...rest, board });
    await this.boardsService.addSlideToBoard(boardId, createdSlide);
    return createdSlide.save();
  }

  async delete(slideId: string): Promise<SlideDocument> {
    const deletedSlide = await this.slideModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!deletedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return deletedSlide;
  }

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

  private validateSlidesLimit(board: BoardDocument): void {
    const slidesCount = board.slides.length;
    if (slidesCount >= this.slidesLimitPerBoard)
      throw new HttpException('Slides limit reached', HttpStatus.BAD_REQUEST);
  }

  // TODO
  // async verifyPermissions(user: UserDocument, slide: SlideDocument): void{
  // }
}
