import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_GW_PORT,
  DEFAULT_RABBITMQ_HOST,
  DEFAULT_RABBITMQ_PORT,
  DEFAULT_SERVER_HOST,
  DEFAULT_SERVER_PORT,
} from './config/dev.config';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { getRabbitConfig } from './config/rabbit.config';
import { getCorsConfig } from './config/cors.config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

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

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are properties that are not defined in the DTO
      transform: true, // automatically transforms input data to the expected types based on the DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const corsConfig: CorsOptions = getCorsConfig(configService);
  app.enableCors(corsConfig);

  const rabbitConfig: RmqOptions = getRabbitConfig(configService);
  app.connectMicroservice<MicroserviceOptions>(rabbitConfig);
  await app.startAllMicroservices();

  await app.listen(serverPort);
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

void bootstrap();
