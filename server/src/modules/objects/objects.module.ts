import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { ResponseModule } from '../response/response.module';

import { SlidesModule } from '../slides/slides.module';
import { ObjectStatsModule } from '../stats/object/object.stats.module';
import { ObjectStatsService } from '../stats/object/object.stats.service';

@Module({
  imports: [ResponseModule, SlidesModule, ObjectStatsModule],
  controllers: [ObjectsController],
  providers: [ObjectsService, ObjectStatsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
