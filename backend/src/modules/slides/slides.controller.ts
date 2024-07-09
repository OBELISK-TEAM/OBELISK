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

@Controller('slides')
export class SlidesController {
  constructor(private slidesService: SlidesService) {}

  @Get()
  async findAll(@Query('page') page: number) {
    return this.slidesService.findAll(page);
  }

  @Post()
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slidesService.create(createSlideDto);
  }

  @Get(':id')
  async findOne(@Param('id') slideId: string) {
    return this.slidesService.findOne(slideId);
  }

  @Put(':id')
  Update(@Body() createSlideDto: CreateSlideDto, @Param('id') slideId: string) {
    return this.slidesService.update(slideId, createSlideDto);
  }

  @Delete(':id')
  async delete(@Param('id') slideId: string) {
    return this.slidesService.delete(slideId);
  }
}
