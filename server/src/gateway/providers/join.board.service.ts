import { Injectable, Logger } from '@nestjs/common';
import { BoardsService } from '../../modules/boards/boards.service';
import {
  GwSocket,
  GwSocketWithTarget,
} from '../../shared/interfaces/auth/GwSocket';
import { JoinBoardData } from '../gateway.dto';
import { Socket } from 'socket.io';
import { BoardPermission } from '../../enums/board.permission';

@Injectable()
export class JoinBoardService {
  constructor(private readonly boardsService: BoardsService) {}
  private readonly logger = new Logger(JoinBoardService.name);

  async handleJoinBoard(client: GwSocket, data: JoinBoardData): Promise<void> {
    const boardId = data.board._id;
    const userId = client.data.user._id as string;

    const permission = await this.boardsService.getClientBoardPermission(
      userId,
      boardId,
    );

    if (!this.isPermissionValid(client, permission)) return;

    this.assignDataToClient(client, permission, boardId);
    await this.joinClientToBoard(client, boardId);
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
      message: `${user.email} has joined the board`,
    });
    this.logger.log(`${user.email} has joined the board ${boardId}`);
  }

  async handleLeaveBoard(client: GwSocketWithTarget): Promise<void> {
    const user = client.data.user;
    const boardId = user.targetBoard.boardId;
    const slideId = user.targetSlide.slideId;

    if (slideId) {
      await client.leave(slideId);
      client.to(slideId).emit('left-slide', {
        message: `${user.email} has left the slide`,
      });
      this.logger.log(`${user.email} has left the slide`);
    }

    await client.leave(boardId);
    client.to(boardId).emit('left-board', {
      message: `${user.email} has left the board`,
    });
    this.logger.log(`${user.email} has left the board`);
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
