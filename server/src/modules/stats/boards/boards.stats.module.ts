import { Module } from '@nestjs/common';
import { BoardsStatsService } from './boards.stats.service';
import { BoardsStatsController } from './boards.stats.controller';

@Module({
  controllers: [BoardsStatsController],
  providers: [BoardsStatsService],
})
export class BoardsStatsModule {}
