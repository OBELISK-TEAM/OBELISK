import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { IntDefaultValuePipe } from '../../../shared/pipes/IntDefaultValuePipe';
import { SlideResponseObject } from '../../../shared/interfaces/response-objects/SlideResponseObject';

@Controller()
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // TODO - check permission to fetch slide

  @Get()
  getSlide(
    @Param('boardId') boardId: string,
    @Query('slide', new IntDefaultValuePipe(1)) slideNumber: number,
  ): Promise<SlideResponseObject> {
    return this.slidesService.getSlide(boardId, slideNumber);
  }

  @Post()
  createSlide(
    @Param('boardId') boardId: string,
    @Query('slide', new IntDefaultValuePipe(-1)) slideNumber: number,
  ): Promise<SlideResponseObject> {
    return this.slidesService.createSlide(boardId, slideNumber);
  }

  @Delete()
  deleteSlide(
    @Param('boardId') boardId: string,
    @Query('slide', new IntDefaultValuePipe(1)) slideNumber: number,
  ): Promise<SlideResponseObject> {
    return this.slidesService.deleteSlide(boardId, slideNumber);
  }
}
