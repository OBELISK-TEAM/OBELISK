import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<SafeUserDoc> {
    const safeUser = await this.authService.validateUserByEmailAndPassword(
      email,
      password,
    );
    if (!safeUser)
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return safeUser;
  }
}
