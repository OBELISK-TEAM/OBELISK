import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { ExecutionContext, Logger, UseGuards } from '@nestjs/common';
import { BoardsService } from '../modules/boards/boards.service';
import { BoardPermission } from '../enums/board.permission';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(Gateway.name);

  constructor(
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly boardsService: BoardsService,
  ) {}

  async handleConnection(client: Socket) {
    await this.validateClient(client);
    this.logger.log(`Client connected: ${client.id} ${client.data.user.email}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // TODO - add proper class validator dto
  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join-board')
  async handleJoinBoard(client: Socket, data: JoinBoardDto) {
    const { boardId } = data;

    try {
      await this.boardsService.findBoardById(boardId);
    } catch (error) {
      client.emit('error', {
        message: 'Invalid board id',
      });
      client.disconnect(true);
      return;
    }

    const permission = this.getBoardPermission(boardId, client);
    if (permission === BoardPermission.NONE) {
      client.emit('error', {
        message: 'You do not have permission to join this board',
      });
      client.disconnect(true);
    }
    client.data.user.permission = permission;

    this.logger.log(
      `${client.data.user._id} is ${BoardPermission[permission]}`,
    );
    this.logger.log(`Joining the board: ${data.boardId}...`);
    client.join(`${data.boardId}`);
  }

  private async validateClient(client: Socket) {
    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;
    await this.wsAuthGuard.canActivate(context);
  }

  private getBoardPermission(boardId: string, socket: Socket): BoardPermission {
    const availableBoards = socket.data.user.availableBoards;
    return this.boardsService.getBoardPermission(boardId, availableBoards);
  }
}

export interface JoinBoardDto {
  boardId: string;
}
