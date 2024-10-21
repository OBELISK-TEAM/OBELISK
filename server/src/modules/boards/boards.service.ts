import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../mongo/schemas/board/super.board.schema';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { BoardPermission } from '../../shared/enums/board.permission';
import { ResponseService } from '../response/response.service';
import { BoardsFilter } from 'src/shared/enums/boardsFilter';
import { FilterQueryBuilder } from './filter.query.builder';
import {
  PaginatedBoardsResponseObject,
  PopulatedBoardResponseObject,
} from '../../shared/interfaces/response-objects/PaginatedUserBoards';
import { BoardWithSlideCount } from '../../shared/interfaces/BoardWithSlideCount';
import { ClientBoardInfo } from '../../shared/interfaces/ClientBoardInfo';
import { BoardWithPopulatedPermissions } from '../../shared/interfaces/PopulatedBoard';
import { BSON } from 'bson';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_MAX_BOARD_SIZE_IN_BYTES } from '../../config/dev.config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';

const DEFAULT_MAX_BOARD_SIZE_IN_BYTES = 1;

@Injectable()
export class BoardsService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
    private readonly configService: ConfigService,
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
    order: SortOrder = 'desc',
    tab: BoardsFilter = BoardsFilter.ALL,
  ): Promise<PaginatedBoardsResponseObject> {
    const query = this.getFilterQuery(userId, tab);
    const [total, boards] = await Promise.all([
      this.queryCountDocuments(query),
      this.findUserRelatedBoards(query, page, limit, order),
    ]);

    const responseBoards = await Promise.all(
      boards.map(board => this.prepareBoardResponse(board, userId)),
    );
    return { boards: responseBoards, page, limit, order, total };
  }

  private async prepareBoardResponse(
    board: SuperBoardDocument,
    userId: string,
  ): Promise<PopulatedBoardResponseObject> {
    const permission = this.determineUserPermission(board, userId);
    const populatedBoard = await this.populatePermissions(board);
    const sizeInBytes = this.calculateBoardSizeInBytes(board);
    return this.res.toResponseBoardWithPopulatedPermissions(
      populatedBoard,
      permission,
      sizeInBytes,
    );
  }

  private async populatePermissions(
    board: SuperBoardDocument,
  ): Promise<BoardWithPopulatedPermissions> {
    return board.populate({
      path: 'permissions.viewer permissions.editor permissions.moderator owner',
      select: 'name email',
    });
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

  async getBoardDetails(
    userId: string,
    boardId: string,
  ): Promise<PopulatedBoardResponseObject> {
    const board = await this.findBoardById(boardId);
    const maxBoardSizeInBytes = this.getMaxBoardSizeInBytes();
    return {
      ...(await this.prepareBoardResponse(board, userId)),
      maxBoardSizeInBytes,
    };
  }

  async getBoardWithSlideCount(
    userId: string,
    boardId: string,
  ): Promise<ClientBoardInfo> {
    const board = await this.findBoardInfo(userId, boardId);
    const permission = this.determineUserPermission(board, userId);
    const { permissions, ...boardInfo } = board;
    return { ...boardInfo, permission };
  }

  private async findBoardInfo(
    userId: string,
    boardId: string,
  ): Promise<BoardWithSlideCount> {
    const queryBuilder = new FilterQueryBuilder();
    const query = queryBuilder.accessibleTo(userId).build();
    const result = await this.boardModel.aggregate<BoardWithSlideCount>([
      { $match: { _id: new Types.ObjectId(boardId), ...query } },
      { $addFields: { slideCount: { $size: '$slides' } } },
      { $project: { slides: 0 } },
    ]);
    if (!result || result.length === 0)
      throw new HttpException(
        'Board not found or insufficient permissions',
        HttpStatus.NOT_FOUND,
      );
    return result[0];
  }

  determineUserPermission(
    board: BoardWithSlideCount | SuperBoardDocument,
    userId: string,
  ): BoardPermission {
    const userIdStr = userId.toString();
    if (board.owner.toString() === userIdStr) return BoardPermission.OWNER;
    if (board.permissions.moderator.some(id => id.toString() === userIdStr))
      return BoardPermission.MODERATOR;
    if (board.permissions.editor.some(id => id.toString() === userIdStr))
      return BoardPermission.EDITOR;
    if (board.permissions.viewer.some(id => id.toString() === userIdStr))
      return BoardPermission.VIEWER;
    return BoardPermission.NONE;
  }

  async findBoardById(boardId: string): Promise<SuperBoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  async findUserRelatedBoards(
    query: FilterQuery<SuperBoardDocument>,
    page: number,
    limit: number,
    order: SortOrder,
  ): Promise<SuperBoardDocument[]> {
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;
    return this.boardModel
      .find(query)
      .sort([['updatedAt', sortOrder]])
      .skip(skip)
      .limit(limit)
      .exec();
  }

  private calculateBoardSizeInBytes(board: SuperBoardDocument): number {
    return BSON.calculateObjectSize(board);
  }

  private async queryCountDocuments(
    query: FilterQuery<SuperBoardDocument>,
  ): Promise<number> {
    return this.boardModel.countDocuments(query).exec();
  }

  private getMaxBoardSizeInBytes(): number {
    return this.configService.get<number>(
      'MAX_BOARD_SIZE_IN_BYTES',
      DEFAULT_MAX_BOARD_SIZE_IN_BYTES,
    );
  }

  async createPermissionLink(
    boardId: string,
    boardPermissionDto: BoardPermissionDto,
  ): Promise<string> {
    const { permission } = boardPermissionDto;
    const uuid = randomUUID();
    await this.cacheManager.set(uuid, permission, 1000 * 10 * 6 * 5); // 5 minutes
    return boardId + uuid; // it will be client domain included
  }

  async grantPermission(userId: string, x: string): Promise<void> {
    const [boardId, uuid] = await this.extractBoardIdAndUuid(x);
    const board = await this.findBoardById(boardId);
    const currPermission = this.determineUserPermission(board, userId);
    const futurePermission = await this.cacheManager.get<BoardPermission>(uuid);

    if (!futurePermission)
      throw new HttpException(
        'Invalid futurePermission link',
        HttpStatus.BAD_REQUEST,
      );
    if (currPermission >= futurePermission)
      throw new HttpException(
        'You already have this permission',
        HttpStatus.BAD_REQUEST,
      );

    await Promise.all([
      this.removePermission(board, userId, currPermission),
      this.assignPermission(board, userId, futurePermission),
    ]);
  }

  private async extractBoardIdAndUuid(x: string): Promise<[string, string]> {
    const boardId = x.slice(0, 24);
    const uuid = x.slice(24);
    return [boardId, uuid];
  }

  private async removePermission(
    board: SuperBoardDocument,
    userId: string,
    permission: BoardPermission,
  ): Promise<void> {
    switch (permission) {
      case BoardPermission.VIEWER:
        board.permissions.viewer = board.permissions.viewer.filter(
          id => id.toString() !== userId,
        );
        break;
      case BoardPermission.EDITOR:
        board.permissions.editor = board.permissions.editor.filter(
          id => id.toString() !== userId,
        );
        break;
      case BoardPermission.MODERATOR:
        board.permissions.moderator = board.permissions.moderator.filter(
          id => id.toString() !== userId,
        );
        break;
      default:
        throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST);
    }
    await board.save();
  }

  private async assignPermission(
    board: SuperBoardDocument,
    userId: string,
    permission: BoardPermission,
  ): Promise<void> {
    switch (permission) {
      case BoardPermission.VIEWER:
        board.permissions.viewer.push(userId);
        break;
      case BoardPermission.EDITOR:
        board.permissions.editor.push(userId);
        break;
      case BoardPermission.MODERATOR:
        board.permissions.moderator.push(userId);
        break;
      default:
        throw new HttpException('Invalid permission', HttpStatus.BAD_REQUEST);
    }
    await board.save();
  }
}

export type SortOrder = 'asc' | 'desc';
