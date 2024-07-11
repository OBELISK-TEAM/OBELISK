import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { Slide, SlideSchema } from '../../schemas/slide.schema';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Slide.name,
        schema: SlideSchema,
      },
    ]),
    BoardsModule,
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
