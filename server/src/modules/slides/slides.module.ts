import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SuperBoard,
  SuperBoardSchema,
} from '../../schemas/board/super.board.schema';
import { ObjectsModule } from '../objects/objects.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SuperBoard.name,
        schema: SuperBoardSchema,
      },
    ]),
    ObjectsModule,
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
  // exports: [SlidesService],
})
export class SlidesModule {}
