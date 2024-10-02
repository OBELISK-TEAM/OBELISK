import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';
import { CreateObjectDto } from './objects.dto';

@Controller('boards/:boardId/slides/:slideId/objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get(':objectId')
  async getObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @Param('objectId') objectId: string,
  ): Promise<ObjectResponseObject> {
    return await this.objectsService.getObject(boardId, slideId, objectId);
  }

  @Post()
  async createObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @Body() createObjectDto: CreateObjectDto,
  ): Promise<ObjectResponseObject> {
    return await this.objectsService.createObject(
      boardId,
      slideId,
      createObjectDto,
    );
  }

  @Put(':objectId')
  async updateObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @Param('objectId') objectId: string,
    @Body() updateObjectDto: CreateObjectDto,
  ): Promise<ObjectResponseObject> {
    return await this.objectsService.updateObject(
      boardId,
      slideId,
      objectId,
      updateObjectDto,
    );
  }

  @Delete(':objectId')
  async deleteObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @Param('objectId') objectId: string,
  ): Promise<ObjectResponseObject> {
    return await this.objectsService.deleteObject(boardId, slideId, objectId);
  }
}
