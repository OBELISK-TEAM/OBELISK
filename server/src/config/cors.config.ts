import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DEFAULT_CORS_ORIGIN } from './dev.config';

export function getCorsConfig(configService: ConfigService): CorsOptions {
  return {
    // set 'origin: true' to allow all origins
    origin: [configService.get<string>('CORS_ORIGIN', DEFAULT_CORS_ORIGIN)],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
}
