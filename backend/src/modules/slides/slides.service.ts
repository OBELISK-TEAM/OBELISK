import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slide } from '../../schemas/slide.schema';
import { CreateSlideDto, UpdateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import { Board } from '../../schemas/board.schema';

@Injectable()
export class SlidesService {
  private readonly pageSize = 1;
  private readonly slidesLimitPerBoard = 10;
  constructor(
    @InjectModel(Slide.name) private readonly slideModel: Model<Slide>,
    private readonly boardService: BoardsService,
  ) {}

  async findAll(page: number = 1): Promise<Slide[]> {
    const skip = (page - 1) * this.pageSize;
    return this.slideModel.find().skip(skip).limit(this.pageSize).exec();
  }

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const { boardId, ...rest } = createSlideDto;
    const board = await this.boardService.findOne(boardId);
    this.validateSlidesLimit(board);
    const createdSlide = new this.slideModel({ ...rest, board });
    await this.boardService.addSlide(boardId, createdSlide);
    return createdSlide.save();
  }

  async findOne(slideId: string): Promise<Slide> {
    const existingSlide = await this.slideModel.findById(slideId).exec();
    if (!existingSlide) throw new HttpException('Slide not found', 404);
    return existingSlide;
  }

  async update(
    slideId: string,
    updateSlideDto: UpdateSlideDto,
  ): Promise<Slide> {
    const existingSlide = await this.slideModel
      .findByIdAndUpdate(slideId, updateSlideDto, { new: true })
      .exec();
    if (!existingSlide) throw new HttpException('Slide not found', 404);
    return existingSlide;
  }

  async delete(slideId: string): Promise<Slide> {
    const existingSlide = await this.slideModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!existingSlide) throw new HttpException('Slide not found', 404);
    return existingSlide;
  }

  private validateSlidesLimit(board: Board): void {
    const slidesCount = board.slides.length;
    if (slidesCount >= this.slidesLimitPerBoard)
      throw new HttpException('Slides limit reached', 400);
  }
}
