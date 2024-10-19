import { Injectable, Logger } from '@nestjs/common';
import { BoardsService } from '../../modules/boards/boards.service';
import {
  GwSocket,
  GwSocketWithTarget,
} from '../../shared/interfaces/auth/GwSocket';
import { JoinBoardData } from '../dto/board.data';
import { Socket } from 'socket.io';
import { BoardPermission } from '../../enums/board.permission';
import { ResponseService } from '../../modules/response/response.service';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { WsException } from '@nestjs/websockets';
import { CommonService } from './common.service';

@Injectable()
export class JoinBoardService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly commonService: CommonService,
    private readonly res: ResponseService,
  ) {}
  private readonly logger = new Logger(JoinBoardService.name);

  async handleJoinBoard(
    client: GwSocket,
    data: JoinBoardData,
  ): Promise<BoardResponseObject> {
    const boardId = data.board._id;
    const userId = client.data.user._id as string;

    const boardInfo = await this.boardsService.getBoardWithSlidesCount(
      userId,
      boardId,
    );

    const permission = boardInfo.permission;

    if (!this.isPermissionValid(client, permission)) {
      throw new WsException('You do not have permission to join this board');
    }

    this.assignDataToClient(client, permission, boardId);
    await this.joinClientToBoard(client, boardId);
    return this.res.toResponseBoardWithSlidesCount(boardInfo);
  }

  private isPermissionValid(
    client: GwSocket,
    permission: BoardPermission,
  ): boolean {
    if (permission === BoardPermission.NONE) {
      this.emitErrorAndDisconnect(
        client,
        'You do not have permission to join this board',
      );
      return false;
    }
    return true;
  }

  private assignDataToClient(
    client: GwSocket,
    permission: BoardPermission,
    boardId: string,
  ): void {
    const user = client.data.user;
    const permissionString = BoardPermission[permission];
    user.targetBoard = { boardId, permission };
    user.targetSlide = { slideNumber: 1, slideId: null };
    this.logger.log(`${user.email} is ${permissionString} of board ${boardId}`);
  }

  private async joinClientToBoard(
    client: GwSocket,
    boardId: string,
  ): Promise<void> {
    const user = client.data.user;
    await client.join(boardId);
    client.to(boardId).emit('joined-board', {
      email: user.email,
      _id: user._id,
    });
    this.logger.log(`${user.email} has joined the board ${boardId}`);
  }

  async handleLeaveBoardAndSlide(client: GwSocketWithTarget): Promise<void> {
    await this.commonService.leaveTarget(client, 'board');
    await this.commonService.leaveTarget(client, 'slide');
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
