import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';

@Controller('boards/:boardId/slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // TODO - check permission to fetch slide
  @Get()
  getSlide(
    @Param('boardId') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<SlideResponseObject> {
    return this.slidesService.getSlide(boardId, slideNumber);
  }

  @Post()
  createSlide(
    @Param('boardId') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<SlideResponseObject> {
    return this.slidesService.createSlide(boardId, slideNumber);
  }

  @Delete()
  deleteSlide(
    @Param('boardId') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<any> {
    return this.slidesService.deleteSlide(boardId, slideNumber);
  }
}
