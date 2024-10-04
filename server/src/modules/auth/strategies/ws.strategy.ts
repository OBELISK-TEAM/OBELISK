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

    // @ts-expect-error I promise that frontend sends an auth object with token field. It's our protocol
    const auth: {token: string} = handshake.auth;

    const token = auth.token;
    const user = await this.authService.validateToken(token);
    if (!user) throw new WsException('Invalid token');
    return user;
  }
}
