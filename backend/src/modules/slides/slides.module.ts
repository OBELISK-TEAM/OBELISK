import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { Slide, SlideSchema } from '../../schemas/slide.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Slide.name,
        schema: SlideSchema,
      },
    ]),
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
