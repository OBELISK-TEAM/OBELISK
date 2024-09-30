import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperBoard } from '../../schemas/board/super.board.schema';
import { SuperSlide } from '../../schemas/slide/super.slide.schema';

@Injectable()
export class SlidesService {
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
  ) {}

  async getSlide(boardId: string, slideNumber: number = 1): Promise<any> {
    const board = await this.boardModel.findOne(
      { _id: boardId },
      {
        slides: { $slice: [slideNumber, 1] },
      },
    );
    if (!board || !board.slides || board.slides.length === 0) {
      throw new Error('Slide not found');
    }
    return board.slides[0];
  }

  async createSlide(boardId: string): Promise<any> {
    const newSlide = new SuperSlide();
    return this.boardModel.findOneAndUpdate(
      { _id: boardId, $expr: { $lt: [{ $size: '$slides' }, 10] } },
      { $push: { slides: newSlide } },
      { new: true },
    );
  }

  async deleteSlide(boardId: string, slideId: string): Promise<any> {
    return this.boardModel.findByIdAndUpdate(
      boardId,
      { $pull: { slides: { _id: slideId } } },
      { new: true },
    );
  }
}
