import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { SlideStatsService } from 'src/modules/stats/slide/slides.stats.service';
import { Types } from 'mongoose';

@Injectable()
export class CommonService {
  constructor(private readonly slideStatsService: SlideStatsService) {}
  private readonly logger = new Logger(CommonService.name);

  async joinTarget(
    client: GwSocketWithTarget,
    targetType: 'board' | 'slide',
  ): Promise<void> {
    const user = client.data.user;

    const targetId =
      targetType === 'board'
        ? user.targetBoard.boardId
        : user.targetSlide?.slideId;

    if (!targetId) return;

    await client.join(targetId);
    client.to(targetId).emit(`joined-${targetType}`, {
      email: user.email,
      id: user._id,
    });

    this.logger.log(`${user.email} has joined the ${targetType} ${targetId}`);
  }

  async leaveTarget(
    client: GwSocketWithTarget,
    targetType: 'board' | 'slide',
  ): Promise<void> {
    const user = client.data.user;

    const targetId =
      targetType === 'board'
        ? user.targetBoard.boardId
        : user.targetSlide?.slideId;

    if (!targetId) return;

    await client.leave(targetId);
    client.to(targetId).emit(`left-${targetType}`, {
      email: user.email,
      _id: user._id,
    });

    this.logger.log(`${user.email} has left the ${targetType} ${targetId}`);

    if (targetType === 'slide') {
      void this.slideStatsService.logLeave(
        targetId.toString(),
        (user._id as Types.ObjectId).toString(),
      );
    }
  }
}
