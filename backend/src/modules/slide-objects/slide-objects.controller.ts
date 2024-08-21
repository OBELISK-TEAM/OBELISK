import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SlideObjectsService } from './slide-objects.service';
import {
  CreateSlideObjectDto,
  UpdateSlideObjectDto,
} from './slide-objects.dto';
import { SlideObjectDocument } from 'src/schemas/slide-object.schema';
import { User } from '../auth/decorators/users.decorator';

@Controller('slide-objects')
export class SlideObjectsController {
  constructor(private readonly slideObjectsService: SlideObjectsService) {}

  @Get()
  async findAll(): Promise<SlideObjectDocument[]> {
    return await this.slideObjectsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') slideObjectId: string,
  ): Promise<SlideObjectDocument> {
    return await this.slideObjectsService.findOneById(slideObjectId);
  }

  @Post()
  async create(
    @User('_id') userId: string,
    @Body() createSlideObjectDto: Partial<CreateSlideObjectDto>,
  ): Promise<SlideObjectDocument> {
    return await this.slideObjectsService.create(userId, createSlideObjectDto);
  }

  @Put(':id')
  async update(
    @User('_id') userId: string,
    @Param('id') slideObjectId: string,
    @Body() updateSlideObjectDto: Partial<UpdateSlideObjectDto>,
  ): Promise<SlideObjectDocument> {
    return await this.slideObjectsService.update(
      userId,
      slideObjectId,
      updateSlideObjectDto,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<SlideObjectDocument> {
    return await this.slideObjectsService.delete(id);
  }
}
