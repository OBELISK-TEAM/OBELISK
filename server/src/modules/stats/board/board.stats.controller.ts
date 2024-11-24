import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BoardStatsService } from './board.stats.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { NumericalTimelineChartData } from 'src/shared/interfaces/stats/ChartData';

@Controller('stats/board')
export class BoardStatsController {
  constructor(private readonly boardStatsService: BoardStatsService) {}

  @Get(':boardId/active-users-over-time')
  @UseGuards(JwtAuthGuard)
  async getActiveUsersOverTime(
    @Param('boardId') boardId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('aggregationIntervalMinutes') aggregationIntervalMinutes: number,
  ): Promise<NumericalTimelineChartData[]> {
    return this.boardStatsService.getActiveUsersOverTime(
      boardId,
      new Date(startDate),
      new Date(endDate),
      aggregationIntervalMinutes,
    );
  }

  @Get(':boardId/unique-visitors')
  @UseGuards(JwtAuthGuard)
  async getTotalUniqeVisitors(@Param('boardId') boardId: string) {
    return this.boardStatsService.getTotalUniqeVisitors(boardId);
  }
}
