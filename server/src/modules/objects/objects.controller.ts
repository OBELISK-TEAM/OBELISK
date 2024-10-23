import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectResponseObject } from '../../shared/interfaces/response-objects/ObjectResponseObject';
import { ObjectProps } from './objects.dto';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async createObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @User('_id') creatorId: string,
    @Body() createObjectDto: ObjectProps,
  ): Promise<ObjectResponseObject> {
    return await this.objectsService.createObject(
      boardId,
      slideId,
      creatorId,
      createObjectDto,
    );
  }

  @Put(':objectId')
  @UseGuards(JwtAuthGuard)
  async updateObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @Param('objectId') objectId: string,
    @User('_id') editorId: string,
    @Body() updateObjectDto: ObjectProps,
  ): Promise<ObjectResponseObject> {
    return await this.objectsService.updateObject(
      boardId,
      slideId,
      objectId,
      editorId,
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
