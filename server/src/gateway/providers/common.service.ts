import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';

@Injectable()
export class CommonService {
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
  }
}
