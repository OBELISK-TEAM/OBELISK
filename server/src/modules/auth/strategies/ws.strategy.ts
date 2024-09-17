import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';

@Injectable()
export class WsCustomStrategy extends PassportStrategy(Strategy, 'ws') {
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

    return this.authService.validateToken(token);
  }
}
