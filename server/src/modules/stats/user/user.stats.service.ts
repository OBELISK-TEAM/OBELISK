import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStats } from 'src/schemas/stats/user.stats.schema';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectModel(UserStats.name)
    private readonly userStatsModel: Model<UserStats>,
  ) {}

  async initStats(userId: string): Promise<void> {
    await this.userStatsModel.create({ userId });
  }

  async removeStats(userId: string): Promise<void> {
    await this.userStatsModel.findOneAndDelete({ userId });
  }

  async updateLastActive(userId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      { userId },
      {
        $set: { lastActiveAt: new Date() },
      },
    );
  }

  async updateLastPasswordChange(userId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      { userId },
      {
        $set: { lastPasswordChange: new Date() },
      },
    );
  }

  async updateBoardAccess(userId: string, boardId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      { userId },
      {
        $set: {
          lastBoardAccesed: { timestamp: new Date(), boardId },
        },
      },
    );
  }

  async logBoardVisit(userId: string, boardId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      { userId },
      {
        $inc: { [`boardsVisits.${boardId}`]: 1 },
      },
      { upsert: true },
    );
  }

  async logBoardInteraction(userId: string, boardId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      { userId },
      {
        $inc: { [`boardsInteractions.${boardId}`]: 1 },
      },
      { upsert: true },
    );
  }

  async logLogin(userId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      { userId },
      {
        $push: {
          loginLogoutTimeline: {
            loginDate: new Date(),
            logoutDate: null,
          },
        },
      },
    );
  }

  async logLogout(userId: string): Promise<void> {
    await this.userStatsModel.updateOne(
      {
        userId,
        'loginLogoutTimeline.logoutDate': null,
      },
      {
        $set: {
          'loginLogoutTimeline.$.logoutDate': new Date(),
        },
      },
    );
  }
}
