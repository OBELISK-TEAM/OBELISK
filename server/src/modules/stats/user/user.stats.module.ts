import { Module } from '@nestjs/common';
import { UserStatsService } from './user.stats.service';
import { UserStatsController } from './user.stats.controller';

@Module({
  controllers: [UserStatsController],
  providers: [UserStatsService],
})
export class UserStatsModule {}
