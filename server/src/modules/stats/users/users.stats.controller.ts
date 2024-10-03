import { Controller } from '@nestjs/common';
import { UsersStatsService } from './users.stats.service';

@Controller('stats/user')
export class UsersStatsController {
  constructor(private readonly usersStatsService: UsersStatsService) {}
}
