import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import {
  SuperSlide,
  SuperSlideDocument,
  SuperSlideSchema,
} from '../../schemas/slide/super.slide.schema';
import { ObjectsService } from '../objects/objects.service';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';

@Injectable()
export class SlidesService {
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
    private readonly objectsService: ObjectsService,
  ) {}

  async getSlide(
    boardId: string,
    slideNumber: number = 1,
  ): Promise<SlideResponseObject> {
    if (slideNumber < 1) {
      throw new HttpException('Invalid slide number', HttpStatus.BAD_REQUEST);
    }
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    }
    if (board.slides.length < slideNumber) {
      throw new HttpException('Invalid slide number', HttpStatus.NOT_FOUND);
    }
    const slide = board.slides[slideNumber - 1];
    return this.toResponseSlide(slide);
  }

  async createSlide(
    boardId: string,
    slideNumber: number = -1,
  ): Promise<SlideResponseObject> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    }
    if (slideNumber > board.slides.length + 1) {
      throw new HttpException('Invalid slide number', HttpStatus.BAD_REQUEST);
    }
    const newSlide = new SuperSlide();
    if (slideNumber > 0) {
      board.slides.splice(slideNumber - 1, 0, newSlide as SuperSlideDocument);
    } else {
      board.slides.push(newSlide as SuperSlideDocument);
    }
    await board.save();

    const createdSlide =
      slideNumber > 0
        ? board.slides[slideNumber - 1]
        : board.slides[board.slides.length - 1];

    return this.toResponseSlide(createdSlide);
  }

  async deleteSlide(boardId: string, slideNumber: number = 1): Promise<any> {
    if (slideNumber < 1) {
      throw new HttpException('Invalid slide number', HttpStatus.BAD_REQUEST);
    }

    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    }

    if (board.slides.length < slideNumber) {
      throw new HttpException('Invalid slide number', HttpStatus.NOT_FOUND);
    }
    const deletedSlide = board.slides.splice(slideNumber - 1, 1)[0];
    board.save();
    return this.toResponseSlide(deletedSlide);
  }

  private toResponseSlide(slide: SuperSlideDocument): SlideResponseObject {
    const { _id, objects, version } = slide.toObject<SuperSlideDocument>();
    return {
      _id: _id as string,
      version,
      objects: objects.map(this.objectsService.toResponseObject),
    };
  }
}
