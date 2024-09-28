import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateSlideDto } from './slides.dto';
import { BoardsService } from '../boards/boards.service';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { UsersService } from '../users/users.service';
import { BoardPermission } from '../../enums/board.permission';
import { SuperObject } from '../../schemas/object/super.object.schema';
import { SuperSlide } from '../../schemas/slide/super.slide.schema';

@Injectable()
export class SlidesService {
  private readonly pageSize = 5;
  private readonly slidesLimitPerBoard = 10;
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
  ) {}

  // async getSlides(page: number = 1): Promise<SlideResponseObject[]> {
  //   const skip = (page - 1) * this.pageSize;
  //   return this.findSlides(skip, this.pageSize).then(slides =>
  //     Promise.all(slides.map(slide => this.toResponseSlide(slide))),
  //   );
  // }
  //
  // async getSlideById(slideId: string): Promise<SlideResponseObject> {
  //   return this.findSlideById(slideId).then(slide =>
  //     this.toResponseSlide(slide),
  //   );
  // }

  async createSlide(boardId: string): Promise<any> {
    const newSlide = new SuperSlide();
    this.boardModel.findByIdAndUpdate(boardId, {
      $push: { slides: newSlide },
    });

    // const board = await this.boardModel.findBoardById(boardId);
    // const createdSlide = await this.createNewSlide(createSlideDto);

    // return createdSlide.save().then(slide => this.toResponseSlide(slide));
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

  async findSlides(skip: number, limit: number): Promise<any[]> {
    return this.boardModel.find().skip(skip).limit(limit).exec();
  }

  async findSlideById(slideId: string): Promise<any> {
    const existingSlide = await this.boardModel.findById(slideId).exec();
    if (!existingSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return existingSlide;
  }

  // async createNewSlide(slide: CreateSlideDto): Promise<any> {
  //   const { boardId, ...rest } = slide;
  //   const createdSlide = new this.boardModel({
  //     ...rest,
  //     board: boardId,
  //   });
  //   return createdSlide.save();
  // }

  async deleteSlideById(boardId: string, slideId: string): Promise<any> {
    const deletedSlide = await this.boardModel
      .findByIdAndDelete(slideId)
      .exec();
    if (!deletedSlide)
      throw new HttpException('Slide not found', HttpStatus.NOT_FOUND);
    return deletedSlide;
  }

  private validateSlidesLimit(board: SuperBoardDocument): void {
    const slidesCount = board.slides.length;
    if (slidesCount >= this.slidesLimitPerBoard)
      throw new HttpException('Slides limit reached', HttpStatus.BAD_REQUEST);
  }

  // private async toResponseSlide(
  //   slide: SuperSlideDocument,
  //   showBoard: boolean = false,
  //   showObjects: boolean = false,
  //   showTimestamps: boolean = false,
  // ): Promise<SlideResponseObject> {
  //   const { _id, objects } = slide.toObject() as SuperSlideDocument;
  //   const responseObject: SlideResponseObject = { _id: _id as string };
  //
  //   if (showObjects) {
  //     await slide.populate('objects');
  //     // responseObject.objects = objects;
  //     // responseObject.objects = await Promise.all(
  //     //   objects.map(object =>
  //     //     this.slideObjectsService.toResponseSlideObject(
  //     //       object as unknown as SlideObjectDocument,
  //     //     ),
  //     //   ),
  //     // );
  //   }
  //
  //   if (showTimestamps) {
  //     responseObject.createdAt = slide.createdAt;
  //     responseObject.updatedAt = slide.updatedAt;
  //   }
  //
  //   return responseObject;
  // }
}
