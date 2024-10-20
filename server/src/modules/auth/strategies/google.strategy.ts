import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleUser } from '../../../shared/interfaces/auth/GoogleUser';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_GOOGLE_CALLBACK_URL,
  DEFAULT_GOOGLE_CLIENT_ID,
  DEFAULT_GOOGLE_CLIENT_SECRET,
} from '../../../config/defaults';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>(
        'GOOGLE_CLIENT_ID',
        DEFAULT_GOOGLE_CLIENT_ID,
      ),
      clientSecret: configService.get<string>(
        'GOOGLE_CLIENT_SECRET',
        DEFAULT_GOOGLE_CLIENT_SECRET,
      ),
      callbackURL: configService.get<string>(
        'GOOGLE_CALLBACK_URL',
        DEFAULT_GOOGLE_CALLBACK_URL,
      ),
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
      throw new HttpException('No email provided', HttpStatus.BAD_REQUEST);
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
