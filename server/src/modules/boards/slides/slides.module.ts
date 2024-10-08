import { Module } from '@nestjs/common';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { BoardsModule } from '../boards.module';
import { ResponseModule } from '../../response/response.module';

@Module({
  imports: [BoardsModule, ResponseModule],
  controllers: [SlidesController],
  providers: [SlidesService],
  exports: [SlidesService],
})
export class SlidesModule {}
