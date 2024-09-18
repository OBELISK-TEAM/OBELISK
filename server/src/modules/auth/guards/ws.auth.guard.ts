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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    try {
      client.data.user = await this.wsStrategy.validate(client.handshake);
      // immediately after authentication, we fetch the available boards for the user
      client.data.user.availableBoards =
        await this.boardsService.getAvailableBoardsForUser(
          client.data.user._id,
        );
    } catch (error) {
      client.emit('error', { message: error.message });
      client.disconnect(true);
      console.log('Unauthorized user');
      return false;
    }
    console.log('Authenticated user:', client.data.user.email);
    return true;
  }
}
