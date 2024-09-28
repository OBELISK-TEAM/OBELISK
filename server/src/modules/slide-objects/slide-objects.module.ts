import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SlideObjectsController } from './slide-objects.controller';
import { SlideObjectsService } from './slide-objects.service';
import {
  SuperObject,
  SuperObjectSchema,
} from '../../schemas/object/super.object.schema';
import { UsersModule } from '../users/users.module';
import { SlidesModule } from '../slides/slides.module';
import { BoardsModule } from '../boards/boards.module';
import { WsObjectsService } from './ws.objects.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SuperObject.name,
        schema: SuperObjectSchema,
      },
    ]),
    UsersModule,
    BoardsModule,
    SlidesModule,
  ],
  controllers: [SlideObjectsController],
  providers: [SlideObjectsService, WsObjectsService],
  exports: [SlideObjectsService, WsObjectsService],
})
export class SlideObjectsModule {}
