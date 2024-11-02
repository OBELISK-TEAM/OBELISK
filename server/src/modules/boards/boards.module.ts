import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ResponseModule } from '../response/response.module';
import {
  SuperBoard,
  SuperBoardSchema,
} from '../../mongo/schemas/board/super.board.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { StatsModule } from '../stats/stats.module';
import { ObjectStatsService } from '../stats/object/object.stats.service';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forFeature([
      {
        name: SuperBoard.name,
        schema: SuperBoardSchema,
      },
    ]),
    UsersModule,
    ResponseModule,
    StatsModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, ObjectStatsService],
  exports: [BoardsService],
})
export class BoardsModule {}
