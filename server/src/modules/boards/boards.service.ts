import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBoardDto } from './boards.dto';
import { Board, BoardDocument } from '../../schemas/board.schema';
import { UsersService } from '../users/users.service';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { SlideDocument } from '../../schemas/slide.schema';
import { BoardPermission } from '../../enums/board.permission';
import { UserDocument } from '../../schemas/user.schema';
import { Permissions, Permissions2 } from '../../shared/interfaces/Permissions';

@Injectable()
export class BoardsService {
  private readonly pageSize = 10;
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    private readonly usersService: UsersService,
  ) {}

  async getBoards(page: number = 1): Promise<BoardResponseObject[]> {
    const skip = (page - 1) * this.pageSize;
    return this.findBoards(skip, this.pageSize).then(boards =>
      Promise.all(boards.map(board => this.toResponseBoard(board))),
    );
  }

  async getBoardById(
    boardId: string,
    slideNumber: number = -1,
  ): Promise<BoardResponseObject> {
    return this.findBoardById(boardId).then(board =>
      this.toResponseBoard(board, slideNumber),
    );
  }

  async createBoard(
    userId: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    const createdBoard = await this.createNewBoard(userId, createBoardDto);
    await this.usersService.addBoardToUser(userId, createdBoard._id as string);
    return createdBoard.save().then(board => this.toResponseBoard(board));
  }

  async updateBoard(
    userId: string,
    boardId: string,
    updateBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    await this.verifyBoardOwner(userId, boardId);
    return this.updateBoardById(boardId, updateBoardDto).then(updatedBoard =>
      this.toResponseBoard(updatedBoard),
    );
  }

  async deleteBoard(
    userId: string,
    boardId: string,
  ): Promise<BoardResponseObject> {
    await this.verifyBoardOwner(userId, boardId);
    await this.usersService.deleteBoardFromUser(userId, boardId);
    return this.deleteBoardById(boardId).then(board =>
      this.toResponseBoard(board),
    );
  }

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

  private async createNewBoard(
    owner: string,
    createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    const createdBoard = new this.boardModel({ ...createBoardDto, owner });
    return createdBoard.save();
  }

  async updateBoardById(
    boardId: string,
    updateBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, updateBoardDto, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return updatedBoard;
  }

  private async deleteBoardById(boardId: string): Promise<BoardDocument> {
    const deletedBoard = await this.boardModel
      .findByIdAndDelete(boardId)
      .exec();
    if (!deletedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return deletedBoard;
  }

  async addSlideToBoard(boardId: string, slideId: string): Promise<void> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { $push: { slides: slideId } }, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
  }

  async deleteSlideFromBoard(boardId: string, slideId: string): Promise<void> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { $pull: { slides: slideId } }, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
  }

  async verifyBoardOwner(userId: string, boardId: string): Promise<void> {
    const owner = await this.usersService.findUserById(userId);
    const board = await this.findBoardById(boardId);
    if (board.owner.toString() !== (owner._id as string).toString())
      throw new HttpException(
        'You are not the owner of this board',
        HttpStatus.FORBIDDEN,
      );
  }

  verifyBoardPermission(
    board: BoardDocument,
    user: UserDocument,
    permission: BoardPermission,
  ): void {
    const isOwner = board.owner.toString() === (user._id as string).toString();
    if (isOwner) return;
    const permissions = board.permissions;
    const userId = user._id as string;
    if (!this.hasUserPermission(userId, permissions, permission))
      throw new HttpException(
        'You do not have permission to perform this action',
        HttpStatus.FORBIDDEN,
      );
  }

  private hasUserPermission(
    userId: string,
    permissions: Permissions,
    permission: BoardPermission,
  ): boolean {
    const userPermission = this.getUserHighestPermission(userId, permissions);
    return userPermission >= permission;
  }

  private getUserHighestPermission(
    userId: string,
    permissions: Permissions,
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
    permissions: Permissions,
  ): Promise<BoardResponseObject> {
    const user = await this.usersService.findUserById(userId);
    const board = await this.findBoardById(boardId);
    this.verifyBoardPermission(board, user, BoardPermission.MODERATOR);
    return this.updateBoardPermissions(boardId, permissions).then(board =>
      this.toResponseBoard(board),
    );
  }

  private async updateBoardPermissions(
    boardId: string,
    permissions: Permissions,
  ): Promise<BoardDocument> {
    const updatedBoard = await this.boardModel
      .findByIdAndUpdate(boardId, { permissions }, { new: true })
      .exec();
    if (!updatedBoard)
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    return updatedBoard;
  }

  async getAvailableBoardsForUser(userId: string): Promise<Permissions2> {
    const boards = await this.fetchBoardsForUser(userId);

    const boardRolesMap = this.initializeUserBoardRolesMap();
    userId = userId.toString();

    boards.forEach(board =>
      this.assignBoardToRoles(board, userId, boardRolesMap),
    );
    return boardRolesMap;
  }

  private initializeUserBoardRolesMap(): Permissions2 {
    return {
      viewer: [] as string[],
      editor: [] as string[],
      moderator: [] as string[],
      owner: [] as string[],
    };
  }

  private assignBoardToRoles(
    board: BoardDocument,
    userId: string,
    userBoardRolesMap: Permissions2,
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

  private async fetchBoardsForUser(userId: string): Promise<BoardDocument[]> {
    return this.boardModel
      .find({
        $or: [
          { owner: userId },
          { 'permissions.viewer': userId },
          { 'permissions.editor': userId },
          { 'permissions.moderator': userId },
        ],
      })
      .exec();
  }

  getBoardPermission(
    boardId: string,
    boardWithPermission: Permissions2,
  ): BoardPermission {
    const { owner, viewer, editor, moderator } = boardWithPermission;
    if (owner.includes(boardId)) return BoardPermission.OWNER;
    if (moderator.includes(boardId)) return BoardPermission.MODERATOR;
    if (editor.includes(boardId)) return BoardPermission.EDITOR;
    if (viewer.includes(boardId)) return BoardPermission.VIEWER;
    return BoardPermission.NONE;
  }

  async toResponseBoard(
    board: BoardDocument,
    showSlide: number = -1,
    showTimestamps: boolean = false,
  ): Promise<BoardResponseObject> {
    const { _id, name, owner, permissions, slides } =
      board.toObject() as BoardDocument;
    const responseObject: BoardResponseObject = {
      _id: _id as string,
      name,
      owner,
      permissions,
      slides,
    };

    if (showSlide >= 0) {
      await board.populate({
        path: 'slides',
        match: { _id: slides[showSlide] },
        populate: { path: 'objects' },
      });
      responseObject.slide = board.slides[0] as unknown as SlideDocument;
    }

    if (showTimestamps) {
      responseObject.createdAt = board.createdAt;
      responseObject.updatedAt = board.updatedAt;
    }
    return responseObject;
  }
}
