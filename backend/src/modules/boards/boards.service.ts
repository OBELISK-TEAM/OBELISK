import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import { Board, BoardDocument } from '../../schemas/board.schema';
import { UsersService } from '../users/users.service';
import { Slide } from '../../schemas/slide.schema';
import { UserDocument } from '../../schemas/user.schema';

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

  async findOneById(boardId: string): Promise<BoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  async create(
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    const { name } = createBoardDto;
    const owner = await this.userService.findOneById(userId);
    const createdBoard = new this.boardModel({ name, owner });
    await this.userService.addBoardToUser(userId, createdBoard);
    return createdBoard.save();
  }

  async update(
    userId: string,
    boardId: string,
    updateBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    await this.verifyBoardOwner(userId, boardId);
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, updateBoardDto, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return updatedBoard;
  }

  async delete(userId: string, boardId: string): Promise<BoardDocument> {
    await this.verifyBoardOwner(userId, boardId);
    const deletedBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!deletedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return deletedBoard;
  }

  async addSlideToBoard(boardId: string, slide: Slide): Promise<void> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { $push: { slides: slide } }, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
  }

  async verifyBoardOwner(userId: string, boardId: string): Promise<void> {
    const owner = await this.userService.findOneById(userId);
    const board = await this.findOneById(boardId);
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (board.owner.toString() !== (owner._id as string).toString())
      throw new HttpException(
        'You are not the owner of this board',
        HttpStatus.FORBIDDEN,
      );
  }

  // verify if user can create slide to board or add slide object to slide
  // async verifyEditPermission(user: UserDocument, board:BoardDocument): Promise<void>{
  //   if(board.owner !== user._id || board.permissions.edit)
  // }
}
