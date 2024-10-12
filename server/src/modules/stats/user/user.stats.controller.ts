import { Controller } from '@nestjs/common';
import { UserStatsService } from './user.stats.service';

@Controller('stats/user')
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}
}
