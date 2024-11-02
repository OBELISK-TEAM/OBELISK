import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
  DEFAULT_RABBITMQ_HOST,
  DEFAULT_RABBITMQ_PORT,
  DEFAULT_RABBITMQ_QUEUE,
} from './dev.config';

export function getRabbitConfig(configService: ConfigService): RmqOptions {
  const rabbitmqHost = configService.get<string>(
    'RABBITMQ_HOST',
    DEFAULT_RABBITMQ_HOST,
  );
  const rabbitmqPort = configService.get<number>(
    'RABBITMQ_PORT',
    DEFAULT_RABBITMQ_PORT,
  );
  const rabbitmqQueue = configService.get<string>(
    'RABBITMQ_QUEUE',
    DEFAULT_RABBITMQ_QUEUE,
  );
  return {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${rabbitmqHost}:${rabbitmqPort}`],
      queue: rabbitmqQueue,
      queueOptions: {
        durable: false,
      },
    },
  };
}
