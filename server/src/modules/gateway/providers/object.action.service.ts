import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../../shared/interfaces/auth/GwSocket';
import { ObjectsService } from '../../core/objects/objects.service';
import { WsException } from '@nestjs/websockets';
import { ObjectResponseObject } from '../../../shared/interfaces/response-objects/ObjectResponseObject';
import {
  AddObjectData,
  DeleteObjectData,
  UpdateObjectData,
} from '../dto/object.data';
import { ObjectStatsService } from 'src/modules/stats/object/object.stats.service';
import { SuperObjectDocument } from 'src/modules/mongo/schemas/object/super.object.schema';
import { Types } from 'mongoose';
import { SlideStatsService } from 'src/modules/stats/slide/slides.stats.service';
import { SlideAction } from 'src/shared/enums/actions/slide.action';
import { BoardStatsService } from 'src/modules/stats/board/board.stats.service';
import { BoardAction } from 'src/shared/enums/actions/board.action';

@Injectable()
export class ObjectActionService {
  private readonly logger = new Logger(ObjectActionService.name);
  constructor(
    private readonly objectsService: ObjectsService,
    private readonly objectStatsService: ObjectStatsService,
    private readonly slideStatsService: SlideStatsService,
    private readonly boardStatsService: BoardStatsService,
  ) {}

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

    const userId = (user._id as Types.ObjectId).toString();
    await this.objectStatsService.initStats(
      createdObject._id.toString(),
      boardId,
      slideId,
      userId,
    );
    void this.slideStatsService.logAction(
      slideId,
      userId,
      createdObject.top ? createdObject.top : null,
      createdObject.left ? createdObject.left : null,
      SlideAction.EDIT_SLIDE,
    );
    void this.boardStatsService.logAction(
      boardId,
      userId,
      slideId,
      BoardAction.EDIT_SLIDE,
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

    const oldObject = await this.objectsService.getObject(
      boardId,
      slideId,
      _id,
    );

    const updatedObject = await this.objectsService.updateObject(
      boardId,
      slideId,
      _id,
      props,
    );

    const userId = (user._id as Types.ObjectId).toString();
    await this.objectStatsService.changeLastInteraction(
      _id,
      userId,
      oldObject as unknown as SuperObjectDocument,
      updatedObject as unknown as SuperObjectDocument,
    );
    void this.slideStatsService.logAction(
      slideId,
      userId,
      updatedObject.top ? updatedObject.top : null,
      updatedObject.left ? updatedObject.left : null,
      SlideAction.EDIT_SLIDE,
    );
    void this.boardStatsService.logAction(
      boardId,
      userId,
      slideId,
      BoardAction.EDIT_SLIDE,
    );

    this.logger.log(`Object updated: ${updatedObject._id} by ${user.email}`);
    client.to(slideId).emit('object-updated', updatedObject);
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

    const userId = (user._id as Types.ObjectId).toString();
    void this.objectStatsService.removeStats(objectId, null, null);
    void this.slideStatsService.logAction(
      slideId,
      userId,
      deletedObject.top ? deletedObject.top : null,
      deletedObject.left ? deletedObject.left : null,
      SlideAction.EDIT_SLIDE,
    );
    void this.boardStatsService.logAction(
      boardId,
      userId,
      slideId,
      BoardAction.EDIT_SLIDE,
    );

    this.logger.log(`Object deleted: ${objectId} by ${user.email}`);
    client.to(slideId).emit('object-deleted', deletedObject);
    return deletedObject;
  }
}
