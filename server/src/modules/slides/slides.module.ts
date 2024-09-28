import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import {
  SuperSlide,
  SuperSlideSchema,
} from '../../schemas/slide/super.slide.schema';
import { BoardsModule } from '../boards/boards.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SuperSlide.name,
        schema: SuperSlideSchema,
      },
    ]),
    UsersModule,
    BoardsModule,
  ],
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}
