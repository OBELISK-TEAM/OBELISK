import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { SlidesModule } from './slides/slides.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [BoardsModule, SlidesModule, ObjectsModule],
  providers: [],
})
export class CoreModule {}
