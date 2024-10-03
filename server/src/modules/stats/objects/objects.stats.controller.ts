import { Controller } from '@nestjs/common';
import { ObjectsStatsService } from './objects.stats.service';

@Controller('stats/object')
export class ObjectsStatsController {
  constructor(private readonly objectsStatsService: ObjectsStatsService) {}
}
