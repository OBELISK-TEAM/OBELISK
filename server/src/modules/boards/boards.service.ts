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
import { BoardsFilter } from 'src/enums/boardsFilter';
import { FilterQueryBuilder } from './filter.query.builder';
import { SuperBoardWithoutSlides } from '../../shared/interfaces/BoardWithoutSlides';
import { PaginatedBoardsResponse } from '../../shared/interfaces/response-objects/PaginatedUserBoards';

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
    page: number = 1,
    limit: number = 5,
    order: string = 'descending',
    tab: BoardsFilter = BoardsFilter.ALL,
  ): Promise<PaginatedBoardsResponse> {
    const query = this.getFilterQuery(userId, tab);
    const [total, boards] = await Promise.all([
      this.queryCountDocuments(query),
      this.findUserRelatedBoards(query, page, limit, order),
    ]);

    const boardWithPermission = boards.map(board => {
      const userPermission = this.determineUserPermission(board, userId);
      return {
        _id: board._id,
        name: board.name,
        permission: BoardPermission[userPermission],
        createdAt: board.createdAt,
        updatedAt: board.updatedAt,
      };
    });

    return { boards: boardWithPermission, page, limit, order, total };
  }

  private getFilterQuery(
    userId: string,
    tab: BoardsFilter,
  ): FilterQuery<SuperBoardDocument> {
    const builder = new FilterQueryBuilder();

    switch (tab) {
      case BoardsFilter.OWNED_BY:
        return builder.ownedBy(userId).build();

      case BoardsFilter.SHARED_FOR:
        return builder.sharedWith(userId).build();

      default:
        return builder.accessibleTo(userId).build();
    }
  }

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
      throw new HttpException(
        'Board not found or insufficient permissions',
        HttpStatus.NOT_FOUND,
      );
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
    if (board.owner.toString() === userId.toString()) {
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
    order: string,
  ): Promise<SuperBoardWithoutSlides[]> {
    const skip = (page - 1) * limit;
    return this.boardModel
      .find(query)
      .sort([['updatedAt', order === 'ascending' ? 'ascending' : 'descending']])
      .skip(skip)
      .limit(limit)
      .select('-slides')
      .exec();
  }

  async queryCountDocuments(query: FilterQuery<SuperBoard>): Promise<number> {
    return this.boardModel.countDocuments(query).exec();
  }
}
