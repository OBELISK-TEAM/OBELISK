import { Module } from '@nestjs/common';
import { UsersStatsService } from './users.stats.service';
import { UsersStatsController } from './users.stats.controller';

@Module({
  controllers: [UsersStatsController],
  providers: [UsersStatsService],
})
export class UsersStatsModule {}
