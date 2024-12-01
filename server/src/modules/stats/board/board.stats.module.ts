import { Module } from '@nestjs/common';
import { BoardStatsService } from './board.stats.service';
import { BoardStatsController } from './board.stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/modules/users/users.module';
import { BoardStats, BoardStatsSchema } from 'src/modules/mongo/schemas/stats/board.stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BoardStats.name,
        schema: BoardStatsSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [BoardStatsController],
  providers: [BoardStatsService],
  exports: [BoardStatsService],
})
export class BoardStatsModule {}
