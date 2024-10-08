import { Module } from '@nestjs/common';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';
import { SlidesModule } from '../slides.module';
import { ResponseModule } from '../../../response/response.module';

@Module({
  imports: [ResponseModule, SlidesModule],
  controllers: [ObjectsController],
  providers: [ObjectsService],
  exports: [ObjectsService],
})
export class ObjectsModule {}
