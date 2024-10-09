import { Module } from '@nestjs/common';
import { BoardStatsModule } from './board/board.stats.module';
import { ObjectsStatsModule } from './objects/objects.stats.module';
import { SlidesStatsModule } from './slides/slides.stats.module';
import { UsersStatsModule } from './users/users.stats.module';

@Module({
  imports: [
    BoardStatsModule,
    ObjectsStatsModule,
    SlidesStatsModule,
    UsersStatsModule,
  ],
})
export class StatsModule {}
