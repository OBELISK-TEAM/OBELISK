import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { ExecutionContext, UseGuards } from '@nestjs/common';
import { BoardsService } from '../modules/boards/boards.service';
import { BoardPermission } from '../enums/board.permission';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly wsAuthGuard: WsAuthGuard,
    private readonly boardsService: BoardsService,
  ) {}

  afterInit() {
    console.log('Gateway initialized on port 3002');
  }

  async handleConnection(client: Socket) {
    const context = {
      switchToWs: () => ({
        getClient: () => client,
      }),
    } as ExecutionContext;
    await this.wsAuthGuard.canActivate(context);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // TODO - add proper class validator dto
  @SubscribeMessage('join-board')
  @UseGuards(WsAuthGuard) // TODO - is it needed?
  async handleJoinBoard(client: Socket, data: JoinBoardDto) {
    console.log(data);
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

    const permission = this.getBoardPermission(data.boardId, client);
    if (permission === BoardPermission.NONE) {
      client.emit('error', {
        message: 'You do not have permission to join this board',
      });
      client.disconnect(true);
    }
    client.data.user.permission = permission;

    console.log(`Client ${client.data.user._id} joined board ${data.boardId}`);
    console.log(
      `Client ${client.data.user._id} has permission ${BoardPermission[permission]}`,
    );

    // TODO - verify permissions
    console.log('Joining board', data.boardId);
    client.join(`${data.boardId}`);
    // client.emit(`someBoardId`, { boardId: '11111' });
  }

  private getBoardPermission(boardId: string, socket: Socket): BoardPermission {
    const availableBoards = socket.data.user.availableBoards;
    return this.boardsService.getBoardPermission(boardId, availableBoards);
  }
}

export interface JoinBoardDto {
  boardId: string;
}
