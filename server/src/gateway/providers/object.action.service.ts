import { Injectable, Logger } from '@nestjs/common';
import { ObjectAction } from '../gateway';
import {
  AddObjectData,
  DeleteObjectData,
  UpdateObjectData,
} from '../gateway.dto';
import { GwSocket } from '../../shared/interfaces/auth/GwSocket';
import { SlideObjectsService } from '../../modules/slide-objects/slide-objects.service';
import { Socket } from 'socket.io';
import { BoardPermission } from '../../enums/board.permission';

@Injectable()
export class ObjectActionService {
  private readonly logger = new Logger(ObjectActionService.name);
  constructor(private readonly slideObjectsService: SlideObjectsService) {}

  async handleObjectAction(
    client: GwSocket,
    data: AddObjectData | UpdateObjectData | DeleteObjectData,
    action: ObjectAction,
  ): Promise<void> {
    if (!this.hasClientPermission(client)) return;

    try {
      switch (action) {
        case ObjectAction.ADD:
          await this.handleAddObject(client, data as AddObjectData);
          break;
        case ObjectAction.UPDATE:
          await this.handleUpdateObject(client, data as UpdateObjectData);
          break;
        case ObjectAction.DELETE:
          await this.handleDeleteObject(client, data as DeleteObjectData);
          break;
      }
    } catch (error) {
      this.emitErrorAndDisconnect(client, 'Something went wrong');
    }
  }

  private async handleAddObject(
    client: GwSocket,
    data: AddObjectData,
  ): Promise<void> {
    if (!client.data.user.availableBoards || !client.data.user.targetBoard) {
      this.emitErrorAndDisconnect(client, 'Something went wrong');
      return;
    }

    const boardId = client.data.user.targetBoard.boardId;
    const userId = client.data.user._id as string;
    const slideId = data.slide._id;
    const objectProps = data.object;

    const createdObject = await this.slideObjectsService.createObject(
      userId,
      slideId,
      objectProps,
    );

    this.logger.log(
      `Object added: ${createdObject._id} by ${client.data.user.email}`,
    );
    client.to(boardId).emit('object-added', createdObject);
  }

  private async handleUpdateObject(
    client: GwSocket,
    data: UpdateObjectData,
  ): Promise<void> {
    if (!client.data.user.availableBoards || !client.data.user.targetBoard) {
      this.emitErrorAndDisconnect(client, 'Something went wrong');
      return;
    }

    const object = data.object;
    const updatedObject = await this.slideObjectsService.updateObject(object);
    const boardId = client.data.user.targetBoard.boardId;

    this.logger.log(
      `Object updated: ${updatedObject._id} by ${client.data.user.email}`,
    );
    client.to(boardId).emit('object-updated', updatedObject);
  }

  private async handleDeleteObject(
    client: GwSocket,
    data: DeleteObjectData,
  ): Promise<void> {
    if (!client.data.user.availableBoards || !client.data.user.targetBoard) {
      this.emitErrorAndDisconnect(client, 'Something went wrong');
      return;
    }

    const boardId = client.data.user.targetBoard.boardId;
    const userId = client.data.user._id as string;
    const slideId = data.slide._id;
    const objectId = data.object._id;

    const deletedObject = await this.slideObjectsService.deleteObject(
      userId,
      slideId,
      objectId,
    );

    client.to(boardId).emit('object-deleted', deletedObject);
  }

  private hasClientPermission(client: GwSocket): boolean {
    if (!client.data.user.availableBoards || !client.data.user.targetBoard) {
      this.emitErrorAndDisconnect(client, 'Something went wrong');
      return false;
    }
    if (
      client.data.user.targetBoard.permission === BoardPermission.VIEWER ||
      client.data.user.targetBoard.permission === BoardPermission.NONE
    ) {
      this.emitErrorAndDisconnect(client, 'Invalid permission');
      return false;
    }
    return true;
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
