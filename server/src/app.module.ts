import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/filters/http.error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { StatsModule } from './modules/stats/stats.module';
import { MongoModule } from './modules/mongo/mongo.module';
import { MailingModule } from './modules/mailing/mailing.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { HealthModule } from './modules/health/health.module';
import { CoreModule } from './modules/core/core.module';

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
    CoreModule,
    AuthModule,
    UsersModule,
    StatsModule,
    MailingModule,
    GatewayModule,
    HealthModule,
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
