import { Controller } from '@nestjs/common';
import { BoardStatsService } from './board.stats.service';

@Controller('stats/board')
export class BoardStatsController {
  constructor(private readonly boardStatsService: BoardStatsService) {}
}
