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
