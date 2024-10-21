import { Module } from '@nestjs/common';
import { BoardStatsModule } from './board/board.stats.module';
import { SlideStatsModule } from './slide/slides.stats.module';
import { UserStatsModule } from './user/user.stats.module';
import { ObjectStatsModule } from './object/object.stats.module';

@Module({
  imports: [
    BoardStatsModule,
    ObjectStatsModule,
    SlideStatsModule,
    UserStatsModule,
  ],
  exports: [
    BoardStatsModule,
    ObjectStatsModule,
    SlideStatsModule,
    UserStatsModule,
  ],
})
export class StatsModule {}
