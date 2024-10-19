import { Module } from '@nestjs/common';
import { BoardStatsService } from './board.stats.service';
import { BoardStatsController } from './board.stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BoardStats,
  BoardStatsSchema,
} from '../../../mongo/schemas/stats/board.stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BoardStats.name,
        schema: BoardStatsSchema,
      },
    ]),
  ],
  controllers: [BoardStatsController],
  providers: [BoardStatsService],
})
export class BoardStatsModule {}
