import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: CallableFunction): void {
    done(null, user);
  }

  async deserializeUser(payload: any, done: CallableFunction): Promise<void> {
    const user = await this.authService.validateUserById(payload._id);
    return user ? done(null, user) : done(null, null);
  }
}
