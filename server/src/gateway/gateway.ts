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
import { BoardPermissionGuard } from '../modules/auth/guards/board.permission.guard';
import { UseGuards } from '@nestjs/common';
import { MinimumBoardPermission } from '../modules/auth/decorators/permissions.decorator';
import { BoardPermission } from '../enums/board.permission';
import { ObjectResponseObject } from '../shared/interfaces/response-objects/ObjectResponseObject';

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

  // TODO - leave board before disconnect
  handleDisconnect(client: Socket): void {
    return this.connectionService.handleDisconnect(client);
  }

  @SubscribeMessage('join-board')
  async handleJoinBoard(client: GwSocket, data: JoinBoardData): Promise<void> {
    return this.joinBoardService.handleJoinBoard(client, data);
  }

  @SubscribeMessage('leave-board')
  async handleLeaveBoard(client: GwSocketWithTarget): Promise<void> {
    return this.joinBoardService.handleLeaveBoard(client);
  }

  @SubscribeMessage('add-object')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  async handleAddObject(
    client: GwSocketWithTarget,
    data: AddObjectData,
  ): Promise<ObjectResponseObject> {
    return this.objectActionService.handleActionObject(
      client,
      data,
      ObjectAction.ADD,
    );
  }

  @SubscribeMessage('update-object')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  async handleUpdateObject(
    client: GwSocketWithTarget,
    data: UpdateObjectData,
  ): Promise<ObjectResponseObject> {
    return this.objectActionService.handleActionObject(
      client,
      data,
      ObjectAction.UPDATE,
    );
  }

  @SubscribeMessage('delete-object')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  async handleDeleteObject(
    client: GwSocketWithTarget,
    data: DeleteObjectData,
  ): Promise<ObjectResponseObject> {
    return this.objectActionService.handleActionObject(
      client,
      data,
      ObjectAction.DELETE,
    );
  }
}
