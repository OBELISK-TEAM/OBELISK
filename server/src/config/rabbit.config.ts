import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
  DEFAULT_RABBIT_HOST,
  DEFAULT_RABBIT_PORT,
  DEFAULT_RABBIT_QUEUE,
} from './dev.config';

export function getRabbitConfig(configService: ConfigService): RmqOptions {
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
