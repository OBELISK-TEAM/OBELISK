import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import {
  SuperBoard,
  SuperBoardDocument,
} from '../../schemas/board/super.board.schema';
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
  ) {}

  // TODO - implement
  // async getUserBoards(userId: string): Promise<any[]> {
  //   return await this.fetchBoardsForUser(userId);
  // }

  async getBoardById(boardId: string): Promise<BoardResponseObject> {
    const board = await this.findBoardById(boardId);
    return this.toResponseBoard(board);
  }

  async createBoard(
    owner: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    return this.toResponseBoard(
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
    return this.toResponseBoard(deletedBoard);
  }

  // async getBoardSlide(boardId: string, slideNumber: number = 1): Promise<any> {
  //   const board = await this.boardModel.findOne(
  //     { _id: boardId },
  //     {
  //       slides: { $slice: [slideNumber, 1] },
  //     },
  //   );
  //   if (!board || !board.slides || board.slides.length === 0) {
  //     throw new Error('Slide not found');
  //   }
  //   return board.slides[0];
  // }

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

  async findBoardById(boardId: string): Promise<SuperBoardDocument> {
    const existingBoard = await this.boardModel.findById(boardId).exec();
    if (!existingBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return existingBoard;
  }

  async deleteBoardById(boardId: string): Promise<SuperBoardDocument> {
    const deletedBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!deletedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return deletedBoard;
  }

  // TODO -  check if user ids exists
  async updatePermissions(
    userId: string,
    boardId: string,
    permissions: BoardPermissions,
  ): Promise<any> {
    return this.updateBoardPermissions(boardId, permissions);
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

  async toResponseBoard(
    board: SuperBoardDocument,
  ): Promise<BoardResponseObject> {
    const { _id, name, owner, permissions, slides } =
      board.toObject<SuperBoardDocument>();

    const newSlides = slides.map(slide => slide._id as string);

    return {
      _id: _id as string,
      name,
      owner,
      permissions,
      slides: newSlides,
    };
  }
}

export interface BoardPermissionsInfo
  extends Pick<SuperBoardDocument, '_id' | 'permissions' | 'owner'> {}
