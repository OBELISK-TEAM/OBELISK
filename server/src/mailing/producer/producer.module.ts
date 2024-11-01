import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import {
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { ProducerController } from './producer.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DEFAULT_RABBIT_HOST,
  DEFAULT_RABBIT_PORT,
  DEFAULT_RABBIT_QUEUE,
} from '../../config/dev.config';

@Module({
  imports: [ConfigModule],
  controllers: [ProducerController],
  providers: [
    ProducerService,
    {
      provide: 'MAILING_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailingConfig = getMailingConfig(configService);
        return ClientProxyFactory.create(mailingConfig);
      },
    },
  ],
  exports: [ProducerService],
})
export class ProducerModule {}

function getMailingConfig(configService: ConfigService): RmqOptions {
  const rabbitHost = configService.get<string>(
    'RABBIT_HOST',
    DEFAULT_RABBIT_HOST,
  );
  const rabbitPort = configService.get<number>(
    'RABBIT_PORT',
    DEFAULT_RABBIT_PORT,
  );
  const rabbitQueue = configService.get<string>(
    'RABBIT_QUEUE',
    DEFAULT_RABBIT_QUEUE,
  );
  return {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitHost}:${rabbitPort}`],
      queue: rabbitQueue,
      queueOptions: {
        durable: false,
      },
    },
  };
}
