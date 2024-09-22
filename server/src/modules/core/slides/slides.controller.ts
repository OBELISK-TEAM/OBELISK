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
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { User } from '../../auth/decorators/users.decorator';
import { SlideResponseObject } from '../../../shared/interfaces/response-objects/SlideResponseObject';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // TODO - add proper role decorator for endpoints that should not be exposed
  // for example this one
  @Get()
  async getSlides(@Query('page') page: number): Promise<SlideResponseObject[]> {
    return this.slidesService.getSlides(page);
  }

  @Get(':id')
  async getSlideById(
    @Param('id') slideId: string,
  ): Promise<SlideResponseObject> {
    return this.slidesService.getSlideById(slideId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createSlide(
    @User('_id') userId: string,
    @Body() createSlideDto: CreateSlideDto,
  ): Promise<SlideResponseObject> {
    return this.slidesService.createSlide(userId, createSlideDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteSlide(
    @User('_id') userId: string,
    @Param('id') slideId: string,
  ): Promise<SlideResponseObject> {
    return this.slidesService.deleteSlide(userId, slideId);
  }
}
