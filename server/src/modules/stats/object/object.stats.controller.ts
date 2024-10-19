import { Controller } from '@nestjs/common';
import { ObjectStatsService } from './object.stats.service';

@Controller('stats/object')
export class ObjectStatsController {
  constructor(private readonly objectStatsService: ObjectStatsService) {}
}
