import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Payload } from '../../../shared/interfaces/Payload';
import { SafeUserDoc } from '../../../shared/interfaces/SafeUserDoc';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO - add configService.get<string>('JWT_SECRET') - currently not working
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: Payload): Promise<SafeUserDoc> {
    const safeUser = await this.authService.validateUserById(payload._id);
    if (!safeUser) throw new HttpException('Invalid token', 401);
    return safeUser;
  }
}
