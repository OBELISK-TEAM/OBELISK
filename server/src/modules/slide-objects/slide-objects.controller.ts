import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SlideObjectsService } from './slide-objects.service';
import { CreateSlideObject } from './slide-objects.dto';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { SlideObjectResponseObject } from '../../shared/interfaces/response-objects/SlideObjectResponseObject';

@Controller('slide-objects')
export class SlideObjectsController {
  constructor(private readonly slideObjectsService: SlideObjectsService) {}

  // @Get()
  // async getSlideObjects(
  //   @Query('page') page: number,
  // ): Promise<SlideObjectResponseObject[]> {
  //   return await this.slideObjectsService.getSlideObjects(page);
  // }
  //
  // @Get(':id')
  // async getSlideObjectById(
  //   @Param('id') slideObjectId: string,
  // ): Promise<SlideObjectResponseObject> {
  //   return await this.slideObjectsService.getSlideObjectById(slideObjectId);
  // }
  //
  // @Post()
  // @UseGuards(JwtAuthGuard)
  // async createSlideObject(
  //   @User('_id') userId: string,
  //   @Body() createSlideObjectDto: CreateSlideObject,
  // ): Promise<SlideObjectResponseObject> {
  //   return await this.slideObjectsService.createSlideObject(
  //     userId,
  //     createSlideObjectDto,
  //   );
  // }
  //
  // @Put(':id')
  // @UseGuards(JwtAuthGuard)
  // async updateSlideObject(
  //   @User('_id') userId: string,
  //   @Param('id') slideObjectId: string,
  //   @Body() updateSlideObjectDto: CreateSlideObject,
  // ): Promise<SlideObjectResponseObject> {
  //   return await this.slideObjectsService.updateSlideObject(
  //     userId,
  //     slideObjectId,
  //     updateSlideObjectDto,
  //   );
  // }
  //
  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // async deleteSlideObject(
  //   @User('_id') userId: string,
  //   @Param('id') slideObjectId: string,
  // ): Promise<SlideObjectResponseObject> {
  //   return await this.slideObjectsService.deleteSlideObject(
  //     userId,
  //     slideObjectId,
  //   );
  // }
}
