import { Module } from '@nestjs/common';
import { UserStatsService } from './user.stats.service';
import { UserStatsController } from './user.stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserStats,
  UserStatsSchema,
} from 'src/schemas/stats/user.stats.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserStats.name,
        schema: UserStatsSchema,
      },
    ]),
  ],
  controllers: [UserStatsController],
  providers: [UserStatsService],
})
export class UserStatsModule {}
