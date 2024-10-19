import { Module } from '@nestjs/common';
import { SlideStatsService } from './slides.stats.service';
import { SlideStatsController } from './slide.stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SlideStats,
  SlideStatsSchema,
} from 'src/mongo/schemas/stats/slide.stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SlideStats.name,
        schema: SlideStatsSchema,
      },
    ]),
  ],
  controllers: [SlideStatsController],
  providers: [SlideStatsService],
})
export class SlideStatsModule {}
