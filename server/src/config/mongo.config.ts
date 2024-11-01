import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { DEFAULT_DB_HOST } from './dev.config';

export function getMongoConfig(
  configService: ConfigService,
): MongooseModuleFactoryOptions {
  const dbName = configService.get<string>('DB_NAME');
  const dbUser = configService.get<string>('DB_USER');
  const dbPassword = configService.get<string>('DB_PASSWORD');
  const dbHost = configService.get<string>('DB_HOST', DEFAULT_DB_HOST);
  const dbPort = configService.get<string>('DB_PORT', '27017');

  const uri =
    dbHost === DEFAULT_DB_HOST
      ? `mongodb://${DEFAULT_DB_HOST}/${dbName}`
      : `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/`;

  return { uri, dbName };
}
