import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsAuthStrategy } from '../strategies/ws.strategy';
import { BoardsService } from '../../boards/boards.service';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';
import { Permissions2 } from '../../../shared/interfaces/Permissions';
import { WsException } from '@nestjs/websockets';
import { BoardPermission } from '../../../enums/board.permission';

export interface CustomSocket extends Socket {
  data: {
    user: SafeUserDoc & {
      availableBoards?: Permissions2;
      permission?: BoardPermission;
    };
  };
}

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly wsStrategy: WsAuthStrategy,
    private readonly boardsService: BoardsService,
  ) {}

  // fetching the available boards for the user after successful authentication
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<CustomSocket>();
    try {
      client.data.user = await this.wsStrategy.validate(client.handshake);
      client.data.user.availableBoards =
        await this.boardsService.getAvailableBoardsForUser(
          client.data.user._id as string,
        );
    } catch (error) {
      if (error instanceof WsException || error instanceof HttpException) {
        client.emit('error', { message: error.message });
      } else {
        client.emit('error', { message: 'Internal server error' });
      }
      client.disconnect(true);
      return false;
    }
    return true;
  }
}
