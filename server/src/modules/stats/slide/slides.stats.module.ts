import { Module } from '@nestjs/common';
import { SlideStatsService } from './slides.stats.service';
import { SlideStatsController } from './slide.stats.controller';

@Module({
  controllers: [SlideStatsController],
  providers: [SlideStatsService],
})
export class SlideStatsModule {}
