import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { BoardPermission } from '../../enums/board.permission';
import { ResponseService } from '../response/response.service';
import { BoardPermissionsInfo } from '../../shared/interfaces/BoardPermissionsInfo';
import { BoardsOwnerShipFilterOption as BoardsOwnerShipFilterOption } from 'src/enums/boards.ownership.filter.option';
import { UserRelatedBoardsPaginatedResponseObject } from 'src/shared/interfaces/response-objects/UserRelatedBoardsPaginatedResponseObject';

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

  async getUserRelatedBoards(
    userId: string,
    boardsOwnershipFilterOption: BoardsOwnerShipFilterOption,
    page: number,
    limit: number,
  ): Promise<UserRelatedBoardsPaginatedResponseObject> {
    let userRelatedBoards: SuperBoardDocument[] = [];
    let userRelatedBoardsCount: number;
    let query;

    switch (boardsOwnershipFilterOption) {
      case BoardsOwnerShipFilterOption.OWNED_BY_CURRENT_USER:
        query = { owner: userId };
        userRelatedBoards = await this.findUserRelatedBoards(
          query,
          page,
          limit,
        );
        userRelatedBoardsCount = await this.countUserRelatedBoards(query);
        break;

      case BoardsOwnerShipFilterOption.SHARED_FOR_CURRENT_USER:
        query = {
          $or: [
            { 'permissions.viewer': userId },
            { 'permissions.editor': userId },
            { 'permissions.moderator': userId },
          ],
        };
        userRelatedBoards = await this.findUserRelatedBoards(
          query,
          page,
          limit,
        );
        userRelatedBoardsCount = await this.countUserRelatedBoards(query);
        break;

      default:
        query = {
          $or: [
            { owner: userId },
            { 'permissions.viewer': userId },
            { 'permissions.editor': userId },
            { 'permissions.moderator': userId },
          ],
        };
        userRelatedBoards = await this.findUserRelatedBoards(
          query,
          page,
          limit,
        );
        userRelatedBoardsCount = await this.countUserRelatedBoards(query);
        break;
    }

    return this.res.toResponseUserRelatedBoardsPaginated(
      userRelatedBoards,
      userId,
      page,
      limit,
      Math.ceil(userRelatedBoardsCount / limit),
    );
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

  async findUserRelatedBoards(
    query: FilterQuery<SuperBoard>,
    page: number,
    limit: number,
  ): Promise<SuperBoardDocument[]> {
    if (limit == 0) return [];

    const skip = (page - 1) * limit;
    return this.boardModel
      .find(query)
      .sort([['updatedAt', 'descending']])
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countUserRelatedBoards(
    query: FilterQuery<SuperBoard>,
  ): Promise<number> {
    return this.boardModel.countDocuments(query).exec();
  }
}
