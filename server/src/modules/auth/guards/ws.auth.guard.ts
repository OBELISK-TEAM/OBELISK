import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { WsAuthStrategy } from '../strategies/ws.strategy';
import { BoardsService } from '../../boards/boards.service';
import { WsException } from '@nestjs/websockets';
import { GatewaySocket } from '../../../shared/interfaces/auth/GatewaySocket';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly wsStrategy: WsAuthStrategy,
    private readonly boardsService: BoardsService,
  ) {}

  // fetching the available boards for the user after successful authentication
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<GatewaySocket>();
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
