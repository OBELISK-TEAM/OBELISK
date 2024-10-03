import { Module } from '@nestjs/common';
import { BoardsStatsModule } from './boards/boards.stats.module';
import { ObjectsStatsModule } from './objects/objects.stats.module';
import { SlidesStatsModule } from './slides/slides.stats.module';
import { UsersStatsModule } from './users/users.stats.module';

@Module({
  imports: [
    BoardsStatsModule,
    ObjectsStatsModule,
    SlidesStatsModule,
    UsersStatsModule
  ]
})
export class StatsModule {}