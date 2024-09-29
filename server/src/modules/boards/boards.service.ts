import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import { UsersService } from '../users/users.service';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { BoardPermissions } from '../../shared/interfaces/BoardPermissions';
import { AvailableBoards } from '../../shared/interfaces/AvailableBoards';
import { BoardPermission } from '../../enums/board.permission';
import { SuperObject } from '../../schemas/object/super.object.schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(SuperBoard.name)
    private readonly boardModel: Model<SuperBoard>,
    private readonly usersService: UsersService,
  ) {}

  async createBoard(
    owner: string,
    createBoardDto: CreateBoardDto,
  ): Promise<any> {
    return this.boardModel.create({
      ...createBoardDto,
      owner,
    });
  }

  async deleteBoard(userId: string, boardId: string): Promise<any> {
    const board = await this.findBoardById(boardId);
    // this.verifyBoardPermission(board, userId, BoardPermission.OWNER);
    return this.boardModel.findByIdAndDelete(boardId).exec();
  }

  async getSlide(boardId: string, slideNumber: number = 1): Promise<any> {
    const board = await this.boardModel.findOne(
      { _id: boardId },
      {
        slides: { $slice: [slideNumber, 1] },
      },
    );
    if (!board || !board.slides || board.slides.length === 0) {
      throw new Error('Slide not found');
    }
    return board.slides[0];
  }

  async createObject(
    boardId: string,
    slideId: string,
    objectProps: any,
  ): Promise<any> {
    const newObject = new SuperObject({ ...objectProps });
    return this.boardModel.findOneAndUpdate(
      { _id: boardId, 'slides._id': slideId },
      { $push: { 'slides.$.objects': newObject } },
      { new: true },
    );
  }

  /////////////////
  ///////////////////////

  async getBoardById(
    boardId: string,
    slideNumber: number = -1,
  ): Promise<BoardResponseObject> {
    return this.findBoardById(boardId).then(board =>
      this.toResponseBoard(board, slideNumber),
    );
  }

  async findBoardById(boardId: string): Promise<SuperBoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  verifyBoardPermission(
    board: SuperBoardDocument,
    userId: string,
    permission: BoardPermission,
  ): void {
    const isOwner = board.owner.toString() === userId.toString();
    if (isOwner) return;
    const permissions = board.permissions;
    if (!this.hasUserPermission(userId, permissions, permission))
      throw new HttpException(
        'You do not have permission to perform this action',
        HttpStatus.FORBIDDEN,
      );
  }

  private hasUserPermission(
    userId: string,
    permissions: BoardPermissions,
    permission: BoardPermission,
  ): boolean {
    const userPermission = this.getUserHighestPermission(userId, permissions);
    return userPermission >= permission;
  }

  private getUserHighestPermission(
    userId: string,
    permissions: BoardPermissions,
  ): BoardPermission {
    if (permissions.moderator.includes(userId))
      return BoardPermission.MODERATOR;
    if (permissions.editor.includes(userId)) return BoardPermission.EDITOR;
    if (permissions.viewer.includes(userId)) return BoardPermission.VIEWER;
    return BoardPermission.VIEWER - 1;
  }

  async updatePermissions(
    userId: string,
    boardId: string,
    permissions: BoardPermissions,
  ): Promise<BoardResponseObject> {
    // this.verifyBoardPermission(board, user, BoardPermission.MODERATOR);
    return this.updateBoardPermissions(boardId, permissions).then(board =>
      this.toResponseBoard(board),
    );
  }

  private async updateBoardPermissions(
    boardId: string,
    permissions: BoardPermissions,
  ): Promise<any> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { permissions }, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return updatedBoard;
  }

  async getAvailableBoardsForUser(userId: string): Promise<AvailableBoards> {
    const boards = await this.fetchBoardsForUser(userId);
    const boardRolesMap = this.initializeUserBoardRolesMap();

    userId = userId.toString();

    boards.forEach(board =>
      this.assignBoardToRoles(board, userId, boardRolesMap),
    );
    return boardRolesMap;
  }

  private initializeUserBoardRolesMap(): AvailableBoards {
    return {
      viewer: [] as string[],
      editor: [] as string[],
      moderator: [] as string[],
      owner: [] as string[],
    };
  }

  private assignBoardToRoles(
    board: BoardPermissionsInfo,
    userId: string,
    userBoardRolesMap: AvailableBoards,
  ): void {
    const boardId = (board._id as string).toString();
    const ownerId = board.owner.toString();
    const viewerIds = board.permissions.viewer.map((id: string) =>
      id.toString(),
    );
    const editorIds = board.permissions.editor.map((id: string) =>
      id.toString(),
    );
    const moderatorIds = board.permissions.moderator.map((id: string) =>
      id.toString(),
    );

    if (viewerIds.includes(userId)) userBoardRolesMap.viewer.push(boardId);
    if (editorIds.includes(userId)) userBoardRolesMap.editor.push(boardId);
    if (moderatorIds.includes(userId))
      userBoardRolesMap.moderator.push(boardId);
    if (ownerId === userId) userBoardRolesMap.owner.push(boardId);
  }

  private async fetchBoardsForUser(
    userId: string,
  ): Promise<BoardPermissionsInfo[]> {
    return this.boardModel
      .find(
        {
          $or: [
            { owner: userId },
            { 'permissions.viewer': userId },
            { 'permissions.editor': userId },
            { 'permissions.moderator': userId },
          ],
        },
        '_id permissions owner',
      )
      .exec();
  }

  getBoardPermission(
    boardId: string,
    boardWithPermission: AvailableBoards,
  ): BoardPermission {
    const { owner, viewer, editor, moderator } = boardWithPermission;
    if (owner.includes(boardId)) return BoardPermission.OWNER;
    if (moderator.includes(boardId)) return BoardPermission.MODERATOR;
    if (editor.includes(boardId)) return BoardPermission.EDITOR;
    if (viewer.includes(boardId)) return BoardPermission.VIEWER;
    return BoardPermission.NONE;
  }

  async toResponseBoard(
    board: SuperBoardDocument,
    showSlide: number = -1,
    showTimestamps: boolean = false,
  ): Promise<BoardResponseObject> {
    const { _id, name, owner, permissions, slides } =
      board.toObject() as SuperBoardDocument;
    const responseObject: BoardResponseObject = {
      _id: _id as string,
      name,
      owner,
      permissions,
    };

    if (showTimestamps) {
      responseObject.createdAt = board.createdAt;
      responseObject.updatedAt = board.updatedAt;
    }
    return responseObject;
  }
}

export interface BoardPermissionsInfo
  extends Pick<SuperBoardDocument, '_id' | 'permissions' | 'owner'> {}
