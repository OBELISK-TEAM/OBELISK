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

    if (!(await this.isBoardValid(client, boardId))) {
      this.emitErrorAndDisconnect(client, 'Invalid board id');
      return;
    }

    const permission = this.getBoardPermission(boardId, client);

    if (!this.isPermissionValid(client, permission)) {
      this.emitErrorAndDisconnect(client, 'Invalid permission');
      return;
    }

    this.assignClientBoardAndPermission(client, permission, boardId);
    await this.joinClientToBoard(client, boardId);
  }

  private async isBoardValid(
    client: GwSocket,
    boardId: string,
  ): Promise<boolean> {
    try {
      return !!(await this.boardsService.findBoardById(boardId));
    } catch {
      this.emitErrorAndDisconnect(client, 'Invalid board id');
      return false;
    }
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }

  private getBoardPermission(
    boardId: string,
    client: GwSocket,
  ): BoardPermission {
    if (!client.data.user.availableBoards) {
      return BoardPermission.NONE;
    }

    const availableBoards = client.data.user.availableBoards;
    return this.boardsService.getBoardPermission(boardId, availableBoards);
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

  private assignClientBoardAndPermission(
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
    this.logger.log(`${user.email} has joined the board`);
  }

  async handleLeaveBoard(client: GwSocketWithTarget): Promise<void> {
    const user = client.data.user;
    const boardId = user.targetBoard.boardId;
    await client.leave(boardId);
    client.to(boardId).emit('left-board', {
      message: `${user.email} has left the board`,
    });
    this.logger.log(`${user.email} has left the board`);
  }
}
