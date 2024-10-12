import { Controller } from '@nestjs/common';
import { SlideStatsService } from './slides.stats.service';

@Controller('stats/slide')
export class SlideStatsController {
  constructor(private readonly slideStatsService: SlideStatsService) {}
}
