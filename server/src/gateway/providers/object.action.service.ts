import { Injectable, Logger } from '@nestjs/common';
import {
  AddObjectData,
  DeleteObjectData,
  UpdateObjectData,
} from '../gateway.dto';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { Socket } from 'socket.io';
import { ObjectAction } from '../../enums/object.action';
import { ObjectsService } from '../../modules/objects/objects.service';

@Injectable()
export class ObjectActionService {
  private readonly logger = new Logger(ObjectActionService.name);
  constructor(private readonly objectsService: ObjectsService) {}

  async handleActionObject(
    client: GwSocketWithTarget,
    data: AddObjectData | UpdateObjectData | DeleteObjectData,
    action: ObjectAction,
  ): Promise<void> {
    try {
      switch (action) {
        case ObjectAction.ADD:
          return this.handleAddObject(client, data as AddObjectData);
        case ObjectAction.UPDATE:
          return this.handleUpdateObject(client, data as UpdateObjectData);
        case ObjectAction.DELETE:
          return this.handleDeleteObject(client, data as DeleteObjectData);
        default:
          this.emitErrorAndDisconnect(client, 'Invalid action');
      }
    } catch (error) {
      this.emitErrorAndDisconnect(client, 'Something went wrong');
    }
  }

  private async handleAddObject(
    client: GwSocketWithTarget,
    data: AddObjectData,
  ): Promise<void> {
    const boardId = client.data.user.targetBoard.boardId;
    const slideId = data.slide._id;
    const objectProps = data.object;

    console.log(boardId, slideId, objectProps);

    const createdObject = await this.objectsService.createObject(
      boardId,
      slideId,
      objectProps,
    );

    console.log(createdObject);

    // this.logger.log(
    //   `Object added: ${createdObject._id} by ${client.data.user.email}`,
    // );
    // client.to(boardId).emit('object-added', createdObject);
  }

  private async handleUpdateObject(
    client: GwSocketWithTarget,
    data: UpdateObjectData,
  ): Promise<void> {
    console.log(data);
    const boardId = client.data.user.targetBoard.boardId;
    const slideId = data.slide._id;
    const objectId = data.object._id;
    const objectProps = data.object;

    const updatedObject = await this.objectsService.updateObject(
      boardId,
      slideId,
      objectId,
      objectProps,
    );

    this.logger.log(
      `Object updated: ${updatedObject._id} by ${client.data.user.email}`,
    );
    client.to(boardId).emit('object-updated', updatedObject);
  }

  private async handleDeleteObject(
    client: GwSocketWithTarget,
    data: DeleteObjectData,
  ): Promise<void> {
    const boardId = client.data.user.targetBoard.boardId;
    const slideId = data.slide._id;
    const objectId = data.object._id;

    const deletedObject = await this.objectsService.deleteObject(
      boardId,
      slideId,
      objectId,
    );

    this.logger.log(
      `Object deleted: ${deletedObject._id} by ${client.data.user.email}`,
    );
    client.to(boardId).emit('object-deleted', deletedObject);
  }

  private emitErrorAndDisconnect(client: Socket, message: string): void {
    client.emit('error', { message });
    client.disconnect(true);
  }
}
