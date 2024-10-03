import { Module } from '@nestjs/common';
import { ObjectsStatsService } from './objects.stats.service';
import { ObjectsStatsController } from './objects.stats.controller';

@Module({
  controllers: [ObjectsStatsController],
  providers: [ObjectsStatsService],
})
export class ObjectsStatsModule {}
