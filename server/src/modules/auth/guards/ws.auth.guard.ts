import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';
import { WsAuthStrategy } from '../strategies/ws.strategy';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly wsStrategy: WsAuthStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    console.log('inside ws.guard.ts');
    console.log(token);

    if (!token) {
      throw new WsException('Token not provided');
    }

    client.data.user = await this.wsStrategy.validate({
      handshake: client.handshake,
    });

    return true;
  }
}
