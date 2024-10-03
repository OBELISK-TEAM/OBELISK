import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/filters/http.error.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { UsersModule } from './modules/users/users.module';
import { BoardsModule } from './modules/boards/boards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { GatewayModule } from './gateway/gateway.module';
import { StatsModule } from './modules/stats/stats.module';

const DEFAULT_DB_HOST = 'localhost';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        getMongoConfig(configService),
      inject: [ConfigService],
    }),
    PassportModule.register({ session: true }),
    AuthModule,
    UsersModule,
    BoardsModule,
    GatewayModule,
    StatsModule
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

function getMongoConfig(
  configService: ConfigService,
): MongooseModuleFactoryOptions {
  const dbName = configService.get<string>('DB_NAME');
  const dbUser = configService.get<string>('DB_USER');
  const dbPassword = configService.get<string>('DB_PASSWORD');
  const dbHost = configService.get<string>('DB_HOST');
  const dbPort = configService.get<string>('DB_PORT');

  if (dbHost === DEFAULT_DB_HOST) {
    return { uri: `mongodb://${DEFAULT_DB_HOST}/${dbName}` };
  }

  return {
    uri: `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/`,
    dbName: dbName,
  };
}
