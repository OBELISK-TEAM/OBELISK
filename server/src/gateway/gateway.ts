import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {
  GwSocket,
  GwSocketWithTarget,
} from '../shared/interfaces/auth/GwSocket';
import {
  AddSlideData,
  DeleteSlideData,
  JoinBoardData,
  JoinSlideData,
} from './gateway.dto';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { BoardPermissionGuard } from '../modules/auth/guards/board.permission.guard';
import { UseGuards } from '@nestjs/common';
import { MinimumBoardPermission } from '../modules/auth/decorators/permissions.decorator';
import { BoardPermission } from '../enums/board.permission';
import { JoinSlideService } from './providers/join.slide.service';
import { SlideResponseObject } from '../shared/interfaces/response-objects/SlideResponseObject';
import { SlideActionService } from './providers/slide.action.service';

// no need to use @UseGuards() decorator here
// because the WsAuthGuard is already applied in the ConnectionService
// auth is done on connection, not on message
// so no need to authenticate every message

@WebSocketGateway(4003, {
  namespace: 'gateway',
})
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly joinBoardService: JoinBoardService,
    private readonly joinSlideService: JoinSlideService,
    private readonly slideActionService: SlideActionService,
  ) {}

  // CONNECTION

  async handleConnection(client: Socket): Promise<void> {
    return this.connectionService.handleConnection(client);
  }

  handleDisconnect(client: Socket): void {
    return this.connectionService.handleDisconnect(client);
  }

  // BOARDS

  // ??? after joining the board - join first slide?
  @SubscribeMessage('join-board')
  async handleJoinBoard(client: GwSocket, data: JoinBoardData): Promise<void> {
    return this.joinBoardService.handleJoinBoard(client, data);
  }

  @SubscribeMessage('leave-board')
  async handleLeaveBoard(client: GwSocketWithTarget): Promise<void> {
    return this.joinBoardService.handleLeaveBoard(client);
  }

  // SLIDES (be at least a viewer to join a slide)

  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.VIEWER)
  @SubscribeMessage('join-slide')
  async handleJoinSlide(
    client: GwSocketWithTarget,
    data: JoinSlideData,
  ): Promise<SlideResponseObject> {
    return this.joinSlideService.handleJoinSlide(client, data);
  }

  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.VIEWER)
  @SubscribeMessage('leave-slide')
  async handleLeaveSlide(client: GwSocketWithTarget): Promise<void> {
    return this.joinSlideService.handleLeaveSlide(client);
  }

  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  @SubscribeMessage('add-slide')
  async handleAddSlide(
    client: GwSocketWithTarget,
    data: AddSlideData,
  ): Promise<void> {
    return this.slideActionService.handleAddSlide(client, data);
  }

  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  @SubscribeMessage('delete-slide')
  async handleDeleteSlide(
    client: GwSocketWithTarget,
    data: DeleteSlideData,
  ): Promise<void> {
    return this.slideActionService.handleDeleteSlide(client, data);
  }

  // OBJECTS

  // @SubscribeMessage('add-object')
  // @UseGuards(BoardPermissionGuard)
  // @MinimumBoardPermission(BoardPermission.EDITOR)
  // async handleAddObject(
  //   client: GwSocketWithTarget,
  //   data: AddObjectData,
  // ): Promise<ObjectResponseObject> {
  //   return this.objectActionService.handleActionObject(
  //     client,
  //     data,
  //     ObjectAction.ADD,
  //   );
  // }
  //
  // @SubscribeMessage('update-object')
  // @UseGuards(BoardPermissionGuard)
  // @MinimumBoardPermission(BoardPermission.EDITOR)
  // async handleUpdateObject(
  //   client: GwSocketWithTarget,
  //   data: UpdateObjectData,
  // ): Promise<ObjectResponseObject> {
  //   return this.objectActionService.handleActionObject(
  //     client,
  //     data,
  //     ObjectAction.UPDATE,
  //   );
  // }
  //
  // @SubscribeMessage('delete-object')
  // @UseGuards(BoardPermissionGuard)
  // @MinimumBoardPermission(BoardPermission.EDITOR)
  // async handleDeleteObject(
  //   client: GwSocketWithTarget,
  //   data: DeleteObjectData,
  // ): Promise<ObjectResponseObject> {
  //   return this.objectActionService.handleActionObject(
  //     client,
  //     data,
  //     ObjectAction.DELETE,
  //   );
  // }
}
