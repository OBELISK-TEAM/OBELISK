import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide, SlideDocument } from '../../schemas/slide.schema';
import { CreateSlideDto, UpdateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import { BoardDocument } from '../../schemas/board.schema';
import { SlideObject } from 'src/schemas/slide-object.schema';

@Injectable()
export class SlidesService {
  private readonly pageSize = 1;
  private readonly slidesLimitPerBoard = 10;
  constructor(
    @InjectModel(Slide.name) private readonly slideModel: Model<Slide>,
    private readonly boardService: BoardsService,
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

  async create(createSlideDto: CreateSlideDto): Promise<SlideDocument> {
    const { boardId, ...rest } = createSlideDto;
    const board: BoardDocument = await this.boardService.findOneById(boardId);
    this.validateSlidesLimit(board);
    const createdSlide = new this.slideModel({ ...rest, board });
    await this.boardService.addSlideToBoard(boardId, createdSlide);
    return createdSlide.save();
  }

  async update(
    slideId: string,
    updateSlideDto: UpdateSlideDto,
  ): Promise<SlideDocument> {
    const updatedSlide = await this.slideModel
      .findByIdAndUpdate(slideId, updateSlideDto, { new: true })
      .exec();
    if (!updatedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return updatedSlide;
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
}
