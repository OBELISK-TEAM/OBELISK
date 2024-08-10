import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SlideObject,
  SlideObjectSchema,
} from 'src/schemas/slide-object.schema';
import { SlideObjectsService } from './slide-objects.service';
import { SlideObjectsController } from './slide-objects.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SlideObject.name,
        schema: SlideObjectSchema,
      },
    ]),
  ],
  controllers: [SlideObjectsController],
  providers: [SlideObjectsService],
  exports: [SlideObjectsService],
})
export class SlideObjectsModule {}
