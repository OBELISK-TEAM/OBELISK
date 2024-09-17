import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsAuthStrategy } from '../strategies/ws.strategy';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly wsStrategy: WsAuthStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    client.data.user = await this.wsStrategy.validate(client.handshake);
    return true;
  }
}
