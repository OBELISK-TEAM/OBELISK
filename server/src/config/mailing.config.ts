import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  DEFAULT_MAILING_HOST,
  DEFAULT_MAILING_PASS,
  DEFAULT_MAILING_PORT,
  DEFAULT_MAILING_SECURE,
  DEFAULT_MAILING_USER,
} from './dev.config';
import { ConfigService } from '@nestjs/config';

export function getMailingConfig(
  configService: ConfigService,
): SMTPTransport.Options {
  return {
    host: configService.get<string>('MAILING_HOST', DEFAULT_MAILING_HOST),
    port: configService.get<number>('MAILING_PORT', DEFAULT_MAILING_PORT),
    secure: configService.get<boolean>(
      'MAILING_SECURE',
      DEFAULT_MAILING_SECURE,
    ),
    auth: {
      user: configService.get<string>('MAILING_USER', DEFAULT_MAILING_USER),
      pass: configService.get<string>('MAILING_PASS', DEFAULT_MAILING_PASS),
    },
  };
}
