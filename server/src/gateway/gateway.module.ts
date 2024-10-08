import { Module } from '@nestjs/common';
import { Gateway } from './gateway';
import { AuthModule } from '../modules/auth/auth.module';
import { BoardsModule } from '../modules/boards/boards.module';
import { ConnectionService } from './providers/connection.service';
import { JoinBoardService } from './providers/join.board.service';
import { JoinSlideService } from './providers/join.slide.service';
import { SlidesModule } from '../modules/boards/slides/slides.module';
import { SlideActionService } from './providers/slide.action.service';
import { ObjectActionService } from './providers/object.action.service';
import { ResponseModule } from '../modules/response/response.module';
import { ObjectsModule } from '../modules/boards/slides/objects/objects.module';

@Module({
  imports: [
    AuthModule,
    BoardsModule,
    SlidesModule,
    ObjectsModule,
    ResponseModule,
  ],
  providers: [
    Gateway,
    ConnectionService,
    JoinBoardService,
    JoinSlideService,
    SlideActionService,
    ObjectActionService,
  ],
})
export class GatewayModule {}
