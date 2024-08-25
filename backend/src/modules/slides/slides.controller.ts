import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SlidesService } from './slides.service';
import { CreateSlideDto } from './slides.dto';
import { SlideDocument } from '../../schemas/slide.schema';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { User } from '../auth/decorators/users.decorator';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // TODO - add proper role decorator for endpoints that should not be exposed
  // for example this one
  @Get()
  async findAll(@Query('page') page: number = 1): Promise<SlideDocument[]> {
    return this.slidesService.findAll(page);
  }

  @Get(':id')
  async findOne(@Param('id') slideId: string): Promise<SlideDocument> {
    return this.slidesService.findOneById(slideId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @User('_id') userId: string,
    @Body() createSlideDto: CreateSlideDto,
  ): Promise<SlideDocument> {
    return this.slidesService.create(userId, createSlideDto);
  }

  @Delete(':id')
  async delete(@Param('id') slideId: string): Promise<SlideDocument> {
    return this.slidesService.delete(slideId);
  }
}
