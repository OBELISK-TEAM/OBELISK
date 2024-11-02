import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/filters/http.error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { UsersModule } from './modules/users/users.module';
import { BoardsModule } from './modules/boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { StatsModule } from './modules/stats/stats.module';
import { MongoModule } from './mongo/mongo.module';
import { MailingModule } from './mailing/mailing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    PassportModule.register({
      session: true,
    }),
    MongoModule,
    AuthModule,
    UsersModule,
    BoardsModule,
    StatsModule,
    MailingModule,
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
  ],
  controllers: [],
})
export class AppModule {}
