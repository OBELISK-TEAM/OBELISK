import { Injectable, Logger } from '@nestjs/common';
import { AddObjectData } from '../gateway.dto';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { ObjectsService } from '../../modules/objects/objects.service';
import { WsException } from '@nestjs/websockets';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';

@Injectable()
export class ObjectActionService {
  private readonly logger = new Logger(ObjectActionService.name);
  constructor(private readonly objectsService: ObjectsService) {}

  async handleAddObject(
    client: GwSocketWithTarget,
    data: AddObjectData,
  ): Promise<ObjectResponseObject> {
    const user = client.data.user;
    const boardId = user.targetBoard.boardId;
    const slideId = user.targetSlide.slideId;
    const objectProps = data.object;

    if (!slideId) {
      throw new WsException('No slide selected');
    }

    const createdObject = await this.objectsService.createObject(
      boardId,
      slideId,
      objectProps,
    );

    this.logger.log(`Object added: ${createdObject._id} by ${user.email}`);
    client.to(slideId).emit('object-added', createdObject);
    return createdObject;
  }

  // async handleActionObject(
  //   client: GwSocketWithTarget,
  //   data: AddObjectData | UpdateObjectData | DeleteObjectData,
  //   action: ObjectAction,
  // ): Promise<ObjectResponseObject> {
  //   try {
  //     switch (action) {
  //       case ObjectAction.ADD:
  //         return this.handleAddObject(client, data as AddObjectData);
  //       case ObjectAction.UPDATE:
  //         return this.handleUpdateObject(client, data as UpdateObjectData);
  //       case ObjectAction.DELETE:
  //         return this.handleDeleteObject(client, data as DeleteObjectData);
  //       default:
  //         this.emitErrorAndDisconnect(client, 'Something went wrong');
  //         throw new WsException('Invalid action');
  //     }
  //   } catch (error) {
  //     this.emitErrorAndDisconnect(client, 'Something went wrong');
  //     throw error;
  //   }
  // }
  //
  // private async handleAddObject(
  //   client: GwSocketWithTarget,
  //   data: AddObjectData,
  // ): Promise<ObjectResponseObject> {
  //   const boardId = client.data.user.targetBoard.boardId;
  //   const slideId = data.slide._id;
  //   const objectProps = data.object;
  //
  //   const createdObject = await this.objectsService.createObject(
  //     boardId,
  //     slideId,
  //     objectProps,
  //   );
  //
  //   this.logger.log(
  //     `Object added: ${createdObject._id} by ${client.data.user.email}`,
  //   );
  //   client.to(boardId).emit('object-added', createdObject);
  //   return createdObject;
  // }
  //
  // private async handleUpdateObject(
  //   client: GwSocketWithTarget,
  //   data: UpdateObjectData,
  // ): Promise<ObjectResponseObject> {
  //   const boardId = client.data.user.targetBoard.boardId;
  //   const slideId = data.slide._id;
  //   const objectId = data.object._id;
  //   const objectProps = data.object;
  //
  //   const updatedObject = await this.objectsService.updateObject(
  //     boardId,
  //     slideId,
  //     objectId,
  //     objectProps,
  //   );
  //
  //   this.logger.log(
  //     `Object updated: ${updatedObject._id} by ${client.data.user.email}`,
  //   );
  //   client.to(boardId).emit('object-updated', updatedObject);
  //   return updatedObject;
  // }
  //
  // private async handleDeleteObject(
  //   client: GwSocketWithTarget,
  //   data: DeleteObjectData,
  // ): Promise<ObjectResponseObject> {
  //   const boardId = client.data.user.targetBoard.boardId;
  //   const slideId = data.slide._id;
  //   const objectId = data.object._id;
  //
  //   const deletedObject = await this.objectsService.deleteObject(
  //     boardId,
  //     slideId,
  //     objectId,
  //   );
  //
  //   this.logger.log(
  //     `Object deleted: ${deletedObject._id} by ${client.data.user.email}`,
  //   );
  //   client.to(boardId).emit('object-deleted', deletedObject);
  //   return deletedObject;
  // }
  //
  // private emitErrorAndDisconnect(client: Socket, message: string): void {
  //   client.emit('error', { message });
  //   client.disconnect(true);
  // }
}
