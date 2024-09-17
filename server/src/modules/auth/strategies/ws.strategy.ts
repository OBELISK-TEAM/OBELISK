import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthStrategy extends PassportStrategy(Strategy, 'ws') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(request: any): Promise<any> {
    console.log('inside ws.strategy.ts');
    console.log(request);

    const token = request.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return null;
    }

    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new WsException('Invalid token');
    }
    return user;
  }
}
