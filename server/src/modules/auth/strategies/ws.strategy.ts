import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';

@Injectable()
export class WsAuthStrategy extends PassportStrategy(Strategy, 'ws') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(handshake: Socket['handshake']): Promise<SafeUserDoc> {
    console.log('inside ws.strategy.ts');
    console.log(handshake);

    if (!handshake.headers.authorization) {
      throw new WsException('Missing token');
    }

    if (!handshake.headers.authorization.startsWith('Bearer ')) {
      throw new WsException('Invalid token format');
    }

    const token = handshake.headers.authorization.split(' ')[1];
    const user = await this.authService.validateToken(token);
    if (!user) throw new WsException('Invalid token');
    console.log(user);
    return user;
  }
}
