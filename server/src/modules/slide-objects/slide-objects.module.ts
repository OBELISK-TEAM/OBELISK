import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SlideObject,
  SlideObjectSchema,
} from 'src/schemas/slide-object.schema';
import { SlideObjectsController } from './slide-objects.controller';
import { SlideObjectsService } from './slide-objects.service';
import { UsersModule } from '../users/users.module';
import { SlidesModule } from '../slides/slides.module';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SlideObject.name,
        schema: SlideObjectSchema,
      },
    ]),
    UsersModule,
    BoardsModule,
    SlidesModule,
  ],
  controllers: [SlideObjectsController],
  providers: [SlideObjectsService],
  exports: [SlideObjectsService],
})
export class SlideObjectsModule {}
