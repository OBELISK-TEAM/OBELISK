import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { WsAuthStrategy } from '../strategies/ws.strategy';
import { WsException } from '@nestjs/websockets';
import { GwSocket } from '../../../shared/interfaces/auth/GwSocket';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly wsStrategy: WsAuthStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<GwSocket>();
    try {
      client.data.user = await this.wsStrategy.validate(client.handshake);
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
