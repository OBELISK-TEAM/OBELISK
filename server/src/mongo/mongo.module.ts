import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { getMongoConfig } from '../config/mogo.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (
        configService: ConfigService,
      ): MongooseModuleFactoryOptions => {
        return getMongoConfig(configService);
      },
      inject: [ConfigService],
    }),
  ],
})
export class MongoModule {}
