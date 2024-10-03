import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { AvailableBoards } from '../../shared/interfaces/AvailableBoards';
import { BoardPermission } from '../../enums/board.permission';
import { BoardPermissionsInfo } from '../../shared/interfaces/BoardPermissionsInfo';
import { ResponseService } from '../response/response.service';

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

  // TODO - implement
  // async getUserBoards(userId: string): Promise<any[]> {
  //   return await this.fetchBoardsForUser(userId);
  // }

  // // TODO -  check if user ids exists
  // async updatePermissions(
  //   userId: string,
  //   boardId: string,
  //   permissions: BoardPermissions,
  // ): Promise<any> {
  //   console.log(userId);
  //   return this.updateBoardPermissions(boardId, permissions);
  // }
  //
  // private async updateBoardPermissions(
  //   boardId: string,
  //   permissions: BoardPermissions,
  // ): Promise<any> {
  //   const updatedBoard = await this.boardModel
  //     .findByIdAndUpdate(boardId, { permissions }, { new: true })
  //     .exec();
  //   if (!updatedBoard)
  //     throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
  //   return updatedBoard;
  // }

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
        '_id name permissions owner',
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

  async findBoardById(boardId: string): Promise<SuperBoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }
}
