import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../modules/auth/guards/ws.auth.guard';
import { GwSocket } from '../shared/interfaces/auth/GwSocket';
import { JoinBoardDto } from './gateway.dto';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly joinBoardService: JoinBoardService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    return this.connectionService.handleConnection(client);
  }

  handleDisconnect(client: Socket): void {
    return this.connectionService.handleDisconnect(client);
  }

  @SubscribeMessage('join-board')
  @UseGuards(WsAuthGuard)
  async handleJoinBoard(client: GwSocket, data: JoinBoardDto): Promise<void> {
    return this.joinBoardService.handleJoinBoard(client, data);
  }
}
