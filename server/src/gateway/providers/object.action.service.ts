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
import { CustomSlideObjectWithId } from '../../shared/interfaces/CustomSlideObject';

@Injectable()
export class ObjectActionService {
  private readonly logger = new Logger(ObjectActionService.name);
  constructor(private readonly slideObjectsService: SlideObjectsService) {}

  async handleObjectAction(
    client: GwSocket,
    data: any,
    action: ObjectAction,
  ): Promise<void> {
    // TODO - verify if user is editor/moderator/owner
    // TODO - if missing - emit error and disconnect
    // use - try catch  - catch emit error and disconnect

    switch (action) {
      case ObjectAction.ADD:
        await this.handleAddObject(client, data);
        break;
      case ObjectAction.UPDATE:
        await this.handleUpdateObject(client, data);
        break;
      case ObjectAction.DELETE:
        await this.handleDeleteObject(client, data);
        break;
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

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
