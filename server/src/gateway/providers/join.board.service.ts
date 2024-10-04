import { Injectable, Logger } from '@nestjs/common';
import { BoardsService } from '../../modules/boards/boards.service';
import {
  GwSocket,
  GwSocketWithTarget,
} from '../../shared/interfaces/auth/GwSocket';
import { JoinBoardData } from '../gateway.dto';
import { Socket } from 'socket.io';
import { BoardPermission } from '../../enums/board.permission';
import { debug } from 'console';

@Injectable()
export class JoinBoardService {
  constructor(private readonly boardsService: BoardsService) {}
  private readonly logger = new Logger(JoinBoardService.name);

  async handleJoinBoard(client: GwSocket, data: JoinBoardData): Promise<string> {
    const boardId = data.board._id;

    if (!(await this.isBoardValid(client, boardId))) {
      this.emitErrorAndDisconnect(client, 'Invalid board id');
      return "failure";
    }

    debug("boardId", boardId);
    const permission = this.getBoardPermission(boardId, client);
    debug("permission", permission);
    if (!this.isPermissionValid(client, permission)) {
      this.emitErrorAndDisconnect(client, 'Invalid permission');
      return "failure";
    }

    this.assignClientBoardAndPermission(client, permission, boardId);
    await this.joinClientToBoard(client, boardId);
    return "success";
  }

  private async isBoardValid(
    client: GwSocket,
    boardId: string,
  ): Promise<boolean> {
    try {
      await this.boardsService.findBoardById(boardId);
      return true;
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
    debug("available boards", client.data.user.availableBoards)
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
    client.data.user.targetBoard = { boardId, permission };
    this.logger.log(
      `${client.data.user.email} is ${BoardPermission[permission]} of board ${boardId}`,
    );
  }

  private async joinClientToBoard(
    client: GwSocket,
    boardId: string,
  ): Promise<void> {
    this.logger.log(`Joining the board...`);
    await client.join(boardId);
    client.to(boardId).emit('joined-board', {
      message: `${client.data.user.email} has joined the board`,
    });
  }

  async handleLeaveBoard(client: GwSocketWithTarget): Promise<string> {
    const user = client.data.user;
    const boardId = user.targetBoard.boardId;
    this.logger.log(`${user.email} is leaving the board...`);
    await client.leave(boardId);
    client.to(boardId).emit('left-board', {
      message: `${user.email} has left the board`,
    });
    return "succ";
  }
}
