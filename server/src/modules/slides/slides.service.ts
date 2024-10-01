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
} from '../../schemas/slide/super.slide.schema';
import { ObjectsService } from '../objects/objects.service';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';

@Injectable()
export class SlidesService {
  private readonly slideLimitPerBoard = 10;

  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
    private readonly objectsService: ObjectsService,
  ) {}

  async getSlide(
    boardId: string,
    slideNumber: number,
  ): Promise<SlideResponseObject> {
    this.validateSlideNumber(slideNumber);
    const board = await this.findBoardById(boardId);

    this.validateExistingSlide(board, slideNumber);
    const slide = this.getSlideByNumber(board, slideNumber);

    return this.toResponseSlide(slide);
  }

  async createSlide(
    boardId: string,
    slideNumber: number,
  ): Promise<SlideResponseObject> {
    const board = await this.findBoardById(boardId);
    this.validateSlideLimit(board);
    this.validateNewSlidePosition(board, slideNumber);

    const newSlide = new SuperSlide();
    this.addSlideToBoard(board, newSlide, slideNumber);
    await board.save();

    return this.toResponseSlide(
      this.getSlideByNumber(
        board,
        slideNumber > 0 ? slideNumber : board.slides.length,
      ),
    );
  }

  async deleteSlide(
    boardId: string,
    slideNumber: number,
  ): Promise<SlideResponseObject> {
    this.validateSlideNumber(slideNumber);

    const board = await this.findBoardById(boardId);
    this.validateExistingSlide(board, slideNumber);

    const deletedSlide = this.removeSlideFromBoard(board, slideNumber);
    await board.save();

    return this.toResponseSlide(deletedSlide);
  }

  private validateSlideNumber(slideNumber: number): void {
    if (slideNumber < 1 || slideNumber > this.slideLimitPerBoard) {
      throw new HttpException('Invalid slide number', HttpStatus.BAD_REQUEST);
    }
  }

  private validateSlideLimit(board: SuperBoard): void {
    if (board.slides.length >= this.slideLimitPerBoard) {
      throw new HttpException('Slide limit reached', HttpStatus.BAD_REQUEST);
    }
  }

  private async findBoardById(boardId: string): Promise<SuperBoardDocument> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    }
    return board;
  }

  private validateNewSlidePosition(
    board: SuperBoard,
    slideNumber: number,
  ): void {
    if (slideNumber === -1) return; // -1 means append to the end
    if (board.slides.length >= this.slideLimitPerBoard) {
      throw new HttpException('Slide limit reached', HttpStatus.BAD_REQUEST);
    }
    if (slideNumber < 1 || slideNumber > board.slides.length + 1) {
      throw new HttpException('Invalid slide number', HttpStatus.BAD_REQUEST);
    }
  }

  private validateExistingSlide(
    board: SuperBoardDocument,
    slideNumber: number,
  ): void {
    if (slideNumber < 1 || slideNumber > board.slides.length) {
      throw new HttpException('Invalid slide number', HttpStatus.NOT_FOUND);
    }
  }

  private getSlideByNumber(
    board: SuperBoardDocument,
    slideNumber: number,
  ): SuperSlideDocument {
    return board.slides[slideNumber - 1];
  }

  private addSlideToBoard(
    board: SuperBoardDocument,
    slide: SuperSlide,
    slideNumber: number,
  ): void {
    if (slideNumber > 0) {
      board.slides.splice(slideNumber - 1, 0, slide as SuperSlideDocument);
    } else {
      board.slides.push(slide as SuperSlideDocument);
    }
  }

  private removeSlideFromBoard(
    board: SuperBoardDocument,
    slideNumber: number,
  ): SuperSlideDocument {
    return board.slides.splice(slideNumber - 1, 1)[0];
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
