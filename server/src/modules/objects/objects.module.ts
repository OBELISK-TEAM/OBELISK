import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
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
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
