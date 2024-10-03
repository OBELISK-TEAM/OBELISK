import { Controller } from '@nestjs/common';
import { BoardsStatsService } from './boards.stats.service';

@Controller('stats/board')
export class BoardsStatsController {
  constructor(private readonly boardsStatsService: BoardsStatsService) {}
}
