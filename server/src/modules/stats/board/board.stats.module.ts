import { Module } from '@nestjs/common';
import { BoardStatsService } from './board.stats.service';
import { BoardStatsController } from './board.stats.controller';

@Module({
  controllers: [BoardStatsController],
  providers: [BoardStatsService],
})
export class BoardStatsModule {}
