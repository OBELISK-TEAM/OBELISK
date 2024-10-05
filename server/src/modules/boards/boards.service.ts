import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { BoardPermission } from '../../enums/board.permission';
import { ResponseService } from '../response/response.service';
import { BoardPermissionsInfo } from '../../shared/interfaces/BoardPermissionsInfo';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
    private readonly res: ResponseService,
  ) {}

  async getBoardById(boardId: string): Promise<BoardResponseObject> {
    const board = await this.findBoardById(boardId);
    return this.res.toResponseBoard(board);
  }

  async createBoard(
    owner: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    return this.res.toResponseBoard(
      await this.boardModel.create({
        ...createBoardDto,
        owner,
      }),
    );
  }

  async deleteBoard(
    owner: string,
    boardId: string,
  ): Promise<BoardResponseObject> {
    const deletedBoard = await this.deleteBoardById(boardId);
    return this.res.toResponseBoard(deletedBoard);
  }

  /////////////////

  async deleteBoardById(boardId: string): Promise<SuperBoardDocument> {
    const deletedBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!deletedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return deletedBoard;
  }

  async getClientBoardPermission(
    userId: string,
    boardId: string,
  ): Promise<BoardPermission> {
    const board = await this.findBoardWithPermissions(userId, boardId);
    if (!board)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return this.determineUserPermission(board, userId);
  }

  private async findBoardWithPermissions(
    userId: string,
    boardId: string,
  ): Promise<BoardPermissionsInfo | null> {
    return this.boardModel
      .findOne(
        {
          _id: boardId,
          $or: [
            { owner: userId },
            { 'permissions.viewer': userId },
            { 'permissions.editor': userId },
            { 'permissions.moderator': userId },
          ],
        },
        'permissions owner',
      )
      .exec();
  }

  private determineUserPermission(
    board: BoardPermissionsInfo,
    userId: string,
  ): BoardPermission {
    if (board.owner === userId) {
      return BoardPermission.OWNER;
    } else if (board.permissions.moderator.includes(userId)) {
      return BoardPermission.MODERATOR;
    } else if (board.permissions.editor.includes(userId)) {
      return BoardPermission.EDITOR;
    } else if (board.permissions.viewer.includes(userId)) {
      return BoardPermission.VIEWER;
    }
    return BoardPermission.NONE;
  }

  async findBoardById(boardId: string): Promise<SuperBoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }
}
