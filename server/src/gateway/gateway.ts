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
import { AddObjectData, JoinBoardDto, UpdateObjectData } from './gateway.dto';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { ObjectActionService } from './providers/object.action.service';

@WebSocketGateway(3002, {
  namespace: 'gateway',
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly joinBoardService: JoinBoardService,
    private readonly objectActionService: ObjectActionService,
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

  @SubscribeMessage('add-object')
  async handleAddObject(client: GwSocket, data: AddObjectData): Promise<void> {
    return this.objectActionService.handleObjectAction(
      client,
      data,
      ObjectAction.ADD,
    );
  }

  @SubscribeMessage('update-object')
  async handleUpdateObject(
    client: GwSocket,
    data: UpdateObjectData,
  ): Promise<void> {
    return this.objectActionService.handleObjectAction(
      client,
      data,
      ObjectAction.UPDATE,
    );
  }

  @SubscribeMessage('delete-object')
  async handleDeleteObject(client: GwSocket, data: any): Promise<void> {
    const boardId = data.boardId;
    client.to(boardId).emit('object-deleted', data);
  }
}

export enum ObjectAction {
  ADD = 1,
  UPDATE = 2,
  DELETE = 3,
}
