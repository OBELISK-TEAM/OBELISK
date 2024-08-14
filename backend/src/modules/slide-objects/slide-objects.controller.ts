import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SlideObjectsService } from './slide-objects.service';
import {
  CreateSlideObjectDto,
  UpdateSlideObjectDto,
} from './slide-objects.dto';
import { SlideObjectDocument } from 'src/schemas/slide-object.schema';

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
    @Body() partialCreateSlideObjectDto: Partial<CreateSlideObjectDto>,
  ): Promise<SlideObjectDocument> {
    if (!partialCreateSlideObjectDto.createdById) {
      throw new HttpException("'createdById' property is required", HttpStatus.BAD_REQUEST);
    }

    if (!partialCreateSlideObjectDto.slideId) {
      throw new HttpException("'slideId' property is required", HttpStatus.BAD_REQUEST);
    }

    return await this.slideObjectsService.create(partialCreateSlideObjectDto as CreateSlideObjectDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() partialUpdateSlideObjectDto: Partial<UpdateSlideObjectDto>,
  ): Promise<SlideObjectDocument> {
    return await this.slideObjectsService.update(id, partialUpdateSlideObjectDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<SlideObjectDocument> {
    return await this.slideObjectsService.delete(id);
  }
}
