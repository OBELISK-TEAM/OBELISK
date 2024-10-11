import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { ResponseModule } from '../response/response.module';
import { BoardsModule } from '../boards/boards.module';

@Module({
  imports: [BoardsModule, ResponseModule],
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}
