import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {
  DEFAULT_GW_PORT,
  DEFAULT_RABBITMQ_HOST,
  DEFAULT_RABBITMQ_PORT,
  DEFAULT_SERVER_HOST,
  DEFAULT_SERVER_PORT,
} from './dev.config';

export function logServerInfo(configService: ConfigService) {
  const serverHost = configService.get<string>(
    'SERVER_HOST',
    DEFAULT_SERVER_HOST,
  );
  const serverPort = configService.get<number>(
    'SERVER_PORT',
    DEFAULT_SERVER_PORT,
  );
  const rabbitmqHost = configService.get<string>(
    'RABBITMQ_HOST',
    DEFAULT_RABBITMQ_HOST,
  );
  const rabbitmqPort = configService.get<number>(
    'RABBITMQ_PORT',
    DEFAULT_RABBITMQ_PORT,
  );
  const gatewayPort = configService.get<number>(
    'SOCKET_GW_PORT',
    DEFAULT_GW_PORT,
  );
  Logger.log(
    `Server running at http://${serverHost}:${serverPort}`,
    'Bootstrap',
  );
  Logger.log(
    `Socket gateway running at ws://${serverHost}:${gatewayPort}/gateway`,
    'Bootstrap',
  );
  Logger.log(
    `RabbitMQ microservice running at amqp://${rabbitmqHost}:${rabbitmqPort}`,
    'Bootstrap',
  );
}
