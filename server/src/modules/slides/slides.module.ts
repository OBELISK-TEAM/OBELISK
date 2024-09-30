import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
// import { BoardsModule } from '../boards/boards.module';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
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
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
  // exports: [SlidesService],
})
export class SlidesModule {}
