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
    if (!handshake.auth || !handshake.auth.token) {
      throw new WsException('Missing token');
    }

    if (typeof handshake.auth.token !== 'string') {
      throw new WsException('Invalid token format');
    }

    if (!handshake.auth.token.startsWith('Bearer ')) {
      throw new WsException('Invalid token format');
    }

    const token = handshake.auth.token.split(' ')[1];
    const user = await this.authService.validateToken(token);
    if (!user) throw new WsException('Invalid token');
    return user;
  }
}
