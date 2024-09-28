import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import {
  SuperBoard,
  SuperBoardSchema,
} from '../../schemas/board/super.board.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SuperBoard.name,
        schema: SuperBoardSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
})
export class BoardsModule {}
