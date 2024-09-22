import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GwSocket } from '../shared/interfaces/auth/GwSocket';
import {
  AddObjectData,
  DeleteObjectData,
  JoinBoardData,
  UpdateObjectData,
} from './gateway.dto';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { ObjectActionService } from './providers/object.action.service';

// no need to use @UseGuards() decorator here
// because the WsAuthGuard is already applied in the ConnectionService
// auth is done on connection, not on message
// so no need to authenticate every message

@WebSocketGateway(4003, {
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
  async handleJoinBoard(client: GwSocket, data: JoinBoardData): Promise<void> {
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
  async handleDeleteObject(
    client: GwSocket,
    data: DeleteObjectData,
  ): Promise<void> {
    return this.objectActionService.handleObjectAction(
      client,
      data,
      ObjectAction.DELETE,
    );
  }
}

export enum ObjectAction {
  ADD = 1,
  UPDATE = 2,
  DELETE = 3,
}
