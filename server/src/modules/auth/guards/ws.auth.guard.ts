import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsAuthStrategy } from '../strategies/ws.strategy';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly wsStrategy: WsAuthStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    try {
      client.data.user = await this.wsStrategy.validate(client.handshake);
    } catch (error) {
      client.emit('error', { message: error.message });
      client.disconnect(true);
      console.log('Unauthorized user');
      return false;
    }
    console.log('Authenticated user: ', client.data.user.email);
    return true;
  }
}
