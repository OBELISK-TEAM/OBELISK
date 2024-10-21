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
      return; // todo: remove those checkers from action services in a way that linter won't complain
    }

    client.to(slideId).emit('cursor-moved', {
      user: {
        _id: user._id,
        email: user.email,
      },
      cursorData: {
        x,
        y,
        color,
      },
    });

    // this.logger.debug(
    //   `Cursor moved by user ${user.email} in slide ${slideId}: (${x}, ${y})`,
    // );
  }


}
