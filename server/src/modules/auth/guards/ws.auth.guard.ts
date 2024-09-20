import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsAuthStrategy } from '../strategies/ws.strategy';
import { BoardsService } from '../../boards/boards.service';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly wsStrategy: WsAuthStrategy,
    private readonly boardsService: BoardsService,
  ) {}

  // fetching the available boards for the user after successful authentication
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    try {
      client.data.user = await this.wsStrategy.validate(client.handshake);
      client.data.user.availableBoards =
        await this.boardsService.getAvailableBoardsForUser(
          client.data.user._id,
        );
    } catch (error) {
      client.emit('error', { message: error.message });
      client.disconnect(true);
      return false;
    }
    return true;
  }
}
