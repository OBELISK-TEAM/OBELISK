import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';
import { WsCustomStrategy } from '../strategies/ws.strategy';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly wsStrategy: WsCustomStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    console.log('inside ws.guard.ts');
    console.log(token);

    if (!token) {
      throw new WsException('Token not provided');
    }

    await this.wsStrategy.validate({
      handshake: client.handshake,
    });

    return true;
  }
}
