import { Injectable, Logger } from '@nestjs/common';
import {
  AddObjectData,
  DeleteObjectData,
  UpdateObjectData,
} from '../gateway.dto';
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

  async handleUpdateObject(
    client: GwSocketWithTarget,
    data: UpdateObjectData,
  ): Promise<ObjectResponseObject> {
    const user = client.data.user;
    const boardId = user.targetBoard.boardId;
    const slideId = user.targetSlide.slideId;

    const { _id, ...props } = data.object;

    if (!slideId) {
      throw new WsException('No slide selected');
    }

    console.log('id', _id);
    console.log('props', props);

    const updatedObject = await this.objectsService.updateObject(
      boardId,
      slideId,
      _id,
      props,
    );

    this.logger.log(`Object updated: ${updatedObject._id} by ${user.email}`);
    client.to(slideId).emit('object-added', updatedObject);
    return updatedObject;
  }

  async handleDeleteObject(
    client: GwSocketWithTarget,
    data: DeleteObjectData,
  ): Promise<ObjectResponseObject> {
    const user = client.data.user;
    const boardId = user.targetBoard.boardId;
    const slideId = user.targetSlide.slideId;
    const objectId = data.object._id;

    if (!slideId) {
      throw new WsException('No slide selected');
    }

    const deletedObject = await this.objectsService.deleteObject(
      boardId,
      slideId,
      objectId,
    );

    this.logger.log(`Object deleted: ${objectId} by ${user.email}`);
    client.to(slideId).emit('object-deleted', deletedObject);
    return deletedObject;
  }
}
