import { Module } from '@nestjs/common';
import { ObjectStatsService } from './object.stats.service';
import { ObjectStatsController } from './object.stats.controller';

@Module({
  controllers: [ObjectStatsController],
  providers: [ObjectStatsService],
})
export class ObjectStatsModule {}
