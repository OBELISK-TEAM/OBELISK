import { Injectable, Logger } from '@nestjs/common';
import { BoardsService } from '../../modules/boards/boards.service';
import { GwSocket } from '../../shared/interfaces/auth/GwSocket';
import { JoinBoardDto } from '../gateway.dto';
import { Socket } from 'socket.io';
import { BoardPermission } from '../../enums/board.permission';

@Injectable()
export class JoinBoardService {
  private readonly logger = new Logger(JoinBoardService.name);
  constructor(private readonly boardsService: BoardsService) {}

  async handleJoinBoard(client: GwSocket, data: JoinBoardDto): Promise<void> {
    const { boardId } = data;

    if (!(await this.isBoardValid(client, boardId))) return;

    const permission = this.getBoardPermission(boardId, client);
    if (!this.isPermissionValid(client, permission)) return;

    this.assignClientPermission(client, permission, boardId);
    await this.joinClientToBoard(client, boardId);
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

  private assignClientPermission(
    client: GwSocket,
    permission: BoardPermission,
    boardId: string,
  ): void {
    client.data.user.permission = permission;
    this.logger.log(
      `${client.data.user.email} is ${BoardPermission[permission]} of board ${boardId}`,
    );
  }

  private async joinClientToBoard(
    client: GwSocket,
    boardId: string,
  ): Promise<void> {
    this.logger.log(`Joining the board...`);
    return client.join(boardId);
  }
}
