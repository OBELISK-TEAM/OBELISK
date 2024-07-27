import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

// TODO - add configService to get env variables

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const firstName = profile.name?.givenName || null;
    const lastName = profile.name?.familyName || null;
    const email = profile.emails?.[0].value || null;
    const picture = profile.photos?.[0].value || null;
    const user = {
      email,
      firstName,
      lastName,
      picture,
      accessToken,
    };
    done(null, user);
  }
}
