import { Module } from '@nestjs/common';
import { BoardsService } from './boards/boards.service';
import { SlidesService } from './slides/slides.service';
import { SlideObjectsService } from './slide-objects/slide-objects.service';
import { CoreService } from './core.service';

@Module({
  imports: [BoardsService, SlidesService, SlideObjectsService],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
