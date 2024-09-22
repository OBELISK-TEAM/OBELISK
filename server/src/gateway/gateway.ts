import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  GwSocket,
  GwSocketWithTarget,
} from '../shared/interfaces/auth/GwSocket';
import {
  AddObjectData,
  DeleteObjectData,
  JoinBoardData,
  UpdateObjectData,
} from './gateway.dto';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { ObjectActionService } from './providers/object.action.service';
import { ObjectAction } from '../enums/object.action';

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
  async handleAddObject(
    client: GwSocketWithTarget,
    data: AddObjectData,
  ): Promise<void> {
    return this.objectActionService.handleActionObject(
      client,
      data,
      ObjectAction.ADD,
    );
  }

  @SubscribeMessage('update-object')
  async handleUpdateObject(
    client: GwSocketWithTarget,
    data: UpdateObjectData,
  ): Promise<void> {
    return this.objectActionService.handleActionObject(
      client,
      data,
      ObjectAction.UPDATE,
    );
  }

  @SubscribeMessage('delete-object')
  async handleDeleteObject(
    client: GwSocketWithTarget,
    data: DeleteObjectData,
  ): Promise<void> {
    return this.objectActionService.handleActionObject(
      client,
      data,
      ObjectAction.DELETE,
    );
  }
}
