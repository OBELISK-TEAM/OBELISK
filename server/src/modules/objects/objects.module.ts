import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ResponseModule } from '../response/response.module';
import {
  SuperBoard,
  SuperBoardSchema,
} from '../../schemas/board/super.board.schema';
import { SlidesModule } from '../slides/slides.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SuperBoard.name,
        schema: SuperBoardSchema,
      },
    ]),
    ResponseModule,
    SlidesModule,
  ],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
