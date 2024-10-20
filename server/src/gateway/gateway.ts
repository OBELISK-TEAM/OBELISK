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
  UpdateObjectData,
} from './dto/object.data';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { BoardPermissionGuard } from '../modules/auth/guards/board.permission.guard';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MinimumBoardPermission } from '../modules/auth/decorators/permissions.decorator';
import { BoardPermission } from '../shared/enums/board.permission';
import { JoinSlideService } from './providers/join.slide.service';
import { SlideResponseObject } from '../shared/interfaces/response-objects/SlideResponseObject';
import { SlideActionService } from './providers/slide.action.service';
import { ObjectResponseObject } from '../shared/interfaces/response-objects/ObjectResponseObject';
import { ObjectActionService } from './providers/object.action.service';
import { WsExceptionFilter } from '../shared/filters/ws.error.filter';
import { BoardResponseObject } from '../shared/interfaces/response-objects/BoardResponseObject';
import { JoinBoardData } from './dto/board.data';
import { AddSlideData, DeleteSlideData, JoinSlideData } from './dto/slide.data';
import { CursorActionService } from './providers/cursor.action.service';
import { CursorData } from '../../dist/shared/interfaces/Cursor';

@WebSocketGateway(4003, {
  namespace: 'gateway',
})
@UseFilters(WsExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class Gateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly joinBoardService: JoinBoardService,
    private readonly joinSlideService: JoinSlideService,
    private readonly slideActionService: SlideActionService,
    private readonly objectActionService: ObjectActionService,
    private readonly cursorActionService: CursorActionService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    return this.connectionService.handleConnection(client);
  }

  handleDisconnect(
    client: Socket | GwSocket | GwSocketWithTarget,
  ): Promise<void> {
    return this.connectionService.handleDisconnect(client);
  }

  @SubscribeMessage('join-board')
  async handleJoinBoard(
    client: GwSocket,
    data: JoinBoardData,
  ): Promise<BoardResponseObject> {
    return this.joinBoardService.handleJoinBoard(client, data);
  }

  @SubscribeMessage('leave-board')
  async handleLeaveBoard(client: GwSocketWithTarget): Promise<void> {
    return this.joinBoardService.handleLeaveBoardAndSlide(client);
  }

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

  @SubscribeMessage('add-object')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  async handleAddObject(
    client: GwSocketWithTarget,
    data: AddObjectData,
  ): Promise<ObjectResponseObject> {
    return this.objectActionService.handleAddObject(client, data);
  }

  @SubscribeMessage('update-object')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  async handleUpdateObject(
    client: GwSocketWithTarget,
    data: UpdateObjectData,
  ): Promise<ObjectResponseObject> {
    return this.objectActionService.handleUpdateObject(client, data);
  }

  @SubscribeMessage('delete-object')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  async handleDeleteObject(
    client: GwSocketWithTarget,
    data: DeleteObjectData,
  ): Promise<ObjectResponseObject> {
    return this.objectActionService.handleDeleteObject(client, data);
  }

  @SubscribeMessage('cursor-move')
  @UseGuards(BoardPermissionGuard)
  @MinimumBoardPermission(BoardPermission.VIEWER)
  handleCursorMove(
    client: GwSocketWithTarget,
    data: CursorData,
  ): void {
    this.cursorActionService.handleCursorMove(client, data);
  }

}
