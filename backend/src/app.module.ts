import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http.error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';

// imports: [MongooseModule.forRoot('mongodb://user:password@ipaddr/db_name')],
// add certificate to the connection for ensure the security (encrypt the data)

const dbName = process.env.DB_NAME || 'mongo_obelisk';
const dbUser = process.env.DB_USER || 'admin';
const dbPassword = process.env.DB_PASSWORD || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';

@Module({
  imports: [
    MongooseModule.forRoot(
      // `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
      `mongodb://localhost/mongo_obelisk`,
    ),
    UsersModule,
    BoardsModule,
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
})
export class AppModule {}
