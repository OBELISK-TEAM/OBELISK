import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleUser } from '../../../shared/interfaces/GoogleUser';

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
  ): GoogleUser {
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    const email = profile.emails?.[0].value;
    const picture = profile.photos?.[0].value;
    if (!email) {
      throw new HttpException('No email provided', 400);
    }
    return {
      email,
      firstName,
      lastName,
      picture,
      accessToken,
    };
  }
}
