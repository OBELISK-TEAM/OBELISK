import { Controller, Get, Param, Query } from '@nestjs/common';
import { SlidesService } from './slides.service';

@Controller('boards/:boardId/slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  // TODO - check permission to fetch slide
  @Get()
  getSlide(
    @Param('boardId') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<void> {
    return this.slidesService.getSlide(boardId, slideNumber);
  }
}
