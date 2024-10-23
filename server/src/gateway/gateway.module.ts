import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../modules/auth/auth.module';
import { BoardsModule } from '../modules/boards/boards.module';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { JoinSlideService } from './providers/join.slide.service';
import { SlidesModule } from '../modules/slides/slides.module';
import { SlideActionService } from './providers/slide.action.service';
import { ObjectActionService } from './providers/object.action.service';
import { ObjectsModule } from '../modules/objects/objects.module';
import { ResponseModule } from '../modules/response/response.module';
import { CommonService } from './providers/common.service';
import { CursorActionService } from './providers/cursor.action.service';
import { ObjectStatsService } from 'src/modules/stats/object/object.stats.service';
import { StatsModule } from 'src/modules/stats/stats.module';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    SlidesModule,
    ObjectsModule,
    ResponseModule,
    StatsModule,
  ],
  providers: [
    Gateway,
    ConnectionService,
    JoinBoardService,
    JoinSlideService,
    SlideActionService,
    ObjectActionService,
    CursorActionService,
    CommonService,
    ObjectStatsService,
  ],
})
export class GatewayModule {}
