import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Payload } from '../../../shared/interfaces/auth/Payload';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_JWT_SECRET } from '../../../config/dev.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', DEFAULT_JWT_SECRET),
    });
  }

  async validate(payload: Payload): Promise<SafeUserDoc> {
    const safeUser = await this.authService.validateUserById(payload._id);
    if (!safeUser)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    return safeUser;
  }
}
