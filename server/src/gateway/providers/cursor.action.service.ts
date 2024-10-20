// src/gateway/providers/cursor.action.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { CursorMoveData } from '../dto/cursor.data';

@Injectable()
export class CursorActionService {
  private readonly logger = new Logger(CursorActionService.name);

  handleCursorMove(
    client: GwSocketWithTarget,
    data: CursorMoveData,
  ): void {
    const user  = client.data.user;
    const { x, y, color } = data;
    const slideId = client.data.user.targetSlide.slideId;

    if (!slideId) {
      this.logger.warn(
        `Client ${user.email} attempted to move cursor without a selected slide.`,
      );
      return;
    }

    client.to(slideId).emit('cursor-move', {
      userId:user._id,
      x,
      y,
      color,
      username: user.email,
    });

    this.logger.debug(
      `Cursor moved by user ${user.email} in slide ${slideId}: (${x}, ${y})`,
    );
  }


}
