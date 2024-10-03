import { Controller } from '@nestjs/common';
import { SlidesStatsService } from './slides.stats.service';

@Controller('stats/slide')
export class SlidesStatsController {
  constructor(private readonly slidesStatsService: SlidesStatsService) {}
}
