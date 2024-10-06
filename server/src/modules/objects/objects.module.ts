import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ResponseModule } from '../response/response.module';

import { SlidesModule } from '../slides/slides.module';

@Module({
  imports: [ResponseModule, SlidesModule],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
