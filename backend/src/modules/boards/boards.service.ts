import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import { Board, BoardDocument } from '../../schemas/board.schema';
import { UsersService } from '../users/users.service';
import { Slide } from '../../schemas/slide.schema';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';

@Injectable()
export class BoardsService {
  private readonly pageSize = 10;
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly userService: UsersService,
  ) {}

  async getBoards(page: number = 1): Promise<BoardResponseObject[]> {
    const skip = (page - 1) * this.pageSize;
    return this.findBoards(skip, this.pageSize).then(boards =>
      Promise.all(boards.map(board => this.toResponseBoard(board))),
    );
  }

  async getBoardById(boardId: string): Promise<BoardResponseObject> {
    return this.findBoardById(boardId).then(board =>
      this.toResponseBoard(board, true),
    );
  }

  async createBoard(
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    const { name } = createBoardDto;
    const owner = await this.userService.findUserById(userId);
    const createdBoard = new this.boardModel({ name, owner: owner._id });
    await this.userService.addBoardToUser(userId, createdBoard._id.toString());
    return createdBoard.save().then(board => this.toResponseBoard(board));
  }

  async updateBoard(
    userId: string,
    boardId: string,
    updateBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    await this.verifyBoardOwner(userId, boardId);
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, updateBoardDto, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return this.toResponseBoard(updatedBoard, true);
  }

  async deleteBoard(
    userId: string,
    boardId: string,
  ): Promise<BoardResponseObject> {
    await this.verifyBoardOwner(userId, boardId);
    await this.userService.deleteBoardFromUser(userId, boardId);
    return this.deleteBoardById(boardId).then(board =>
      this.toResponseBoard(board),
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////

  private async findBoards(
    skip: number,
    limit: number,
  ): Promise<BoardDocument[]> {
    return this.boardModel.find().skip(skip).limit(limit).exec();
  }

  async findBoardById(boardId: string): Promise<BoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  private async deleteBoardById(boardId: string): Promise<BoardDocument> {
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
    const owner = await this.userService.findUserById(userId);
    const board = await this.findBoardById(boardId);
    // TODO - ugly - make it better
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (board.owner.toString() !== (owner._id as string).toString())
      throw new HttpException(
        'You are not the owner of this board',
        HttpStatus.FORBIDDEN,
      );
  }

  private toResponseBoard(
    board: BoardDocument,
    showSlides: boolean = false,
  ): BoardResponseObject {
    const { _id, name, owner, permissions, slides } = board;
    const responseObject: BoardResponseObject = {
      _id: _id as string,
      name,
      owner,
      permissions,
    };
    if (showSlides) responseObject.slides = slides;
    return responseObject;
  }

  // TODO - implement
  // async verifyBoardPermission(user: UserDocument, board: BoardDocument, permission: BoardPermission)
}
