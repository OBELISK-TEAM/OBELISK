import { Module } from '@nestjs/common';
import { SlidesStatsService } from './slides.stats.service';
import { SlidesStatsController } from './slides.stats.controller';

@Module({
  controllers: [SlidesStatsController],
  providers: [SlidesStatsService],
})
export class SlidesStatsModule {}
