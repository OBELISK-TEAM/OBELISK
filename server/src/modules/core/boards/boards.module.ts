import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../../users/users.module';
import { ResponseModule } from '../../response/response.module';
import {
  SuperBoard,
  SuperBoardSchema,
} from '../../mongo/schemas/board/super.board.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { StatsModule } from '../../stats/stats.module';

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
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
