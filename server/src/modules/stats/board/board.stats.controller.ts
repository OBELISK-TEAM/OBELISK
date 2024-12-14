import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BoardStatsService } from './board.stats.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.auth.guard';
import { NumericalTimelineChartData } from 'src/shared/interfaces/stats/NumericalTimelineChartData';
import { TimeSpentData } from 'src/shared/interfaces/stats/TimeSpentData';

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
  async getTotalUniqeVisitors(
    @Param('boardId') boardId: string,
  ): Promise<number> {
    return this.boardStatsService.getTotalUniqeVisitors(boardId);
  }

  @Get(':boardId/times-spent')
  @UseGuards(JwtAuthGuard)
  async getTimesSpentOnBoardInMs(
    @Param('boardId') boardId: string,
  ): Promise<TimeSpentData[]> {
    return this.boardStatsService.getTimesSpentOnBoardInMs(boardId);
  }

  @Get(':boardId/board-actions-over-time')
  @UseGuards(JwtAuthGuard)
  async getBoardActionsOverTime(
    @Param('boardId') boardId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('aggregationIntervalMinutes') aggregationIntervalMinutes: number,
  ): Promise<NumericalTimelineChartData[]> {
    return this.boardStatsService.getBoardActionsOverTime(
      boardId,
      new Date(startDate),
      new Date(endDate),
      aggregationIntervalMinutes,
    );
  }
}
