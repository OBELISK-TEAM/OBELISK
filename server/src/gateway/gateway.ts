import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ExecutionContext, Logger, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { BoardsService } from '../modules/boards/boards.service';
import { BoardPermission } from '../enums/board.permission';
import { JoinBoardDto } from './gateway.dto';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  // @WebSocketServer() private readonly server: Server;
  private readonly logger = new Logger(Gateway.name);

  constructor(
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly boardsService: BoardsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      await this.validateClient(client);
      this.logClientConnection(client);
    } catch (error) {
      this.emitErrorAndDisconnect(client, 'Authentication failed');
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join-board')
  async handleJoinBoard(client: Socket, data: JoinBoardDto): Promise<void> {
    const { boardId } = data;

    if (!(await this.isBoardValid(client, boardId))) return;

    const permission = this.getBoardPermission(boardId, client);
    if (!this.isPermissionValid(client, permission)) return;

    this.assignClientPermission(client, permission, boardId);
    this.joinClientToBoard(client, boardId);
  }

  private async validateClient(client: Socket): Promise<void> {
    const context = this.createExecutionContext(client);
    await this.wsAuthGuard.canActivate(context);
  }

  private createExecutionContext(client: Socket): ExecutionContext {
    return {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;
  }

  private logClientConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.data.user.email} ${client.id}`);
  }

  private async isBoardValid(
    client: Socket,
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

  private getBoardPermission(boardId: string, client: Socket): BoardPermission {
    const availableBoards = client.data.user.availableBoards;
    return this.boardsService.getBoardPermission(boardId, availableBoards);
  }

  private isPermissionValid(
    client: Socket,
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
    client: Socket,
    permission: BoardPermission,
    boardId: string,
  ): void {
    client.data.user.permission = permission;
    this.logger.log(
      `${client.data.user.email} is ${BoardPermission[permission]} of board ${boardId}`,
    );
  }

  private joinClientToBoard(client: Socket, boardId: string): void {
    this.logger.log(`Joining the board...`);
    client.join(boardId);
  }
}
