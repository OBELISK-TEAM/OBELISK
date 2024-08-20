import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import { Board, BoardDocument } from '../../schemas/board.schema';
import { UsersService } from '../users/users.service';
import { Slide } from '../../schemas/slide.schema';

@Injectable()
export class BoardsService {
  private readonly pageSize = 10;
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly userService: UsersService,
  ) {}

  async findAll(page: number = 1): Promise<BoardDocument[]> {
    const skip = (page - 1) * this.pageSize;
    return this.boardModel.find().skip(skip).limit(this.pageSize).exec();
  }

  async create(
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    const { name } = createBoardDto;
    const owner = await this.userService.findOneById(userId);
    const createdBoard = new this.boardModel({ name, owner });
    await this.userService.addBoard(userId, createdBoard);
    return createdBoard.save();
  }

  async findOneById(boardId: string): Promise<BoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard) throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  async update(
    boardId: string,
    updateBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    const existingBoard = await this.boardModel
      .findByIdAndUpdate(boardId, updateBoardDto, { new: true })
      .exec();
    if (!existingBoard) throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  async delete(boardId: string): Promise<BoardDocument> {
    const existingBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!existingBoard) throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  async addSlide(boardId: string, slide: Slide): Promise<void> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { $push: { slides: slide } }, { new: true })
      .exec();
    if (!updatedBoard) throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
  }
}
