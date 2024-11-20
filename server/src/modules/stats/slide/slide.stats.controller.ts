import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { SlideStatsService } from './slides.stats.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';

@Controller('stats/slide')
export class SlideStatsController {
  constructor(private readonly slideStatsService: SlideStatsService) {}

  @Get(':slideId/heatmap')
  @UseGuards(JwtAuthGuard)
  async getActionsHeatmapData(
    @Param('slideId') slideId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.slideStatsService.getActionsHeatmapData(
      slideId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}
