import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import { Board } from '../../schemas/board.schema';
import { UsersService } from '../users/users.service';
import { Slide } from '../../schemas/slide.schema';

@Injectable()
export class BoardsService {
  private readonly limit = 10;
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly userService: UsersService,
  ) {}

  async findAll(page: number = 1): Promise<Board[]> {
    const skip = (page - 1) * this.limit;
    return this.boardModel.find().skip(skip).limit(this.limit).exec();
  }

  async create(userId: string, createBoardDto: CreateBoardDto): Promise<Board> {
    const { name } = createBoardDto;
    const owner = await this.userService.findOne(userId);
    const createdBoard = new this.boardModel({ name, owner });
    await this.userService.addBoard(userId, createdBoard);
    return createdBoard.save();
  }

  async findOne(boardId: string): Promise<Board> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard) throw new HttpException('Board not found', 404);
    return existingBoard;
  }

  async update(
    boardId: string,
    updateBoardDto: CreateBoardDto,
  ): Promise<Board> {
    const existingBoard = await this.boardModel
      .findByIdAndUpdate(boardId, updateBoardDto, { new: true })
      .exec();
    if (!existingBoard) throw new HttpException('Board not found', 404);
    return existingBoard;
  }

  async delete(boardId: string): Promise<Board> {
    const existingBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!existingBoard) throw new HttpException('Board not found', 404);
    return existingBoard;
  }

  async addSlide(boardId: string, slide: Slide): Promise<void> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { $push: { slides: slide } }, { new: true })
      .exec();
    if (!updatedBoard) throw new HttpException('Board not found', 404);
  }
}
