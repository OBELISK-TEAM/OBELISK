import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { ResponseModule } from '../response/response.module';
import {
  SuperBoard,
  SuperBoardSchema,
} from '../../schemas/board/super.board.schema';
import { Routes } from '@nestjs/core';
import { SlidesModule } from './slides/slides.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SuperBoard.name,
        schema: SuperBoardSchema,
      },
    ]),
    UsersModule,
    ResponseModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
