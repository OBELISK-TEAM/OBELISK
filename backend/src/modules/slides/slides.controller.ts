import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './slides.dto';
import { SlideDocument } from '../../schemas/slide.schema';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  async findAll(@Query('page') page: number): Promise<SlideDocument[]> {
    return this.slidesService.findAll(page);
  }

  @Get(':id')
  async findOne(@Param('id') slideId: string): Promise<SlideDocument> {
    return this.slidesService.findOneById(slideId);
  }

  @Post()
  create(@Body() createSlideDto: CreateSlideDto): Promise<SlideDocument> {
    return this.slidesService.create(createSlideDto);
  }

  @Put(':id')
  Update(
    @Param('id') slideId: string,
    @Body() createSlideDto: CreateSlideDto,
  ): Promise<SlideDocument> {
    return this.slidesService.update(slideId, createSlideDto);
  }

  @Delete(':id')
  async delete(@Param('id') slideId: string): Promise<SlideDocument> {
    return this.slidesService.delete(slideId);
  }
}
