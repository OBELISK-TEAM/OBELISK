import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { GoogleUser } from '../../../shared/interfaces/GoogleUser';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: GoogleUser, done: CallableFunction): void {
    done(null, user);
  }

  // TODO - add types - add when frontend is ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deserializeUser(payload: any, done: CallableFunction): Promise<void> {
    // eslint-disable-next-line  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    const user = await this.authService.validateUserById(payload._id);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user ? done(null, user) : done(null, null);
  }
}
