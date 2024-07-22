import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/filters/http.error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { UsersModule } from './modules/auth/users/users.module';
import { BoardsModule } from './modules/boards/boards.module';
import { SlidesModule } from './modules/slides/slides.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
  ThrottlerOptions,
} from '@nestjs/throttler';

const DEFAULT_THROTTLE_TTL = 60;
const DEFAULT_THROTTLE_LIMIT = 10;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        // useFactory: async (configService: ConfigService) => {
        // const dbName = configService.get<string>('DB_NAME', 'mongo_obelisk');
        // const dbUser = configService.get<string>('DB_USER', 'admin');
        // const dbPassword = configService.get<string>('DB_PASSWORD', 'password');
        // const dbHost = configService.get<string>('DB_HOST', 'localhost');
        // const dbPort = configService.get<string>('DB_PORT', '27017');
        return {
          // uri: `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
          uri: `mongodb://localhost/mongo_obelisk`,
        };
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
        const ttl = configService.get<number>(
          'THROTTLE_TTL',
          DEFAULT_THROTTLE_TTL,
        );
        const limit = configService.get<number>(
          'THROTTLE_LIMIT',
          DEFAULT_THROTTLE_LIMIT,
        );
        const throttlerOptions: ThrottlerOptions = { ttl, limit };
        return {
          throttlers: [throttlerOptions],
          errorMessage: 'Too many requests',
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BoardsModule,
    SlidesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
