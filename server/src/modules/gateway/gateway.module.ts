import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../auth/auth.module';
import { BoardsModule } from '../core/boards/boards.module';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { JoinSlideService } from './providers/join.slide.service';
import { SlidesModule } from '../core/slides/slides.module';
import { SlideActionService } from './providers/slide.action.service';
import { ObjectActionService } from './providers/object.action.service';
import { ObjectsModule } from '../core/objects/objects.module';
import { ResponseModule } from '../response/response.module';
import { CommonService } from './providers/common.service';
import { CursorActionService } from './providers/cursor.action.service';
import { StatsModule } from 'src/modules/stats/stats.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    SlidesModule,
    ObjectsModule,
    ResponseModule,
    StatsModule,
    UsersModule,
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
  ],
})
export class GatewayModule {}
