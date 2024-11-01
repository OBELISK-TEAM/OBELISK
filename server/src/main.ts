import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_SERVER_PORT } from './config/dev.config';
import { MicroserviceOptions, RmqOptions } from '@nestjs/microservices';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { getRabbitConfig } from './config/rabbit.config';
import { getCorsConfig } from './config/cors.config';
import { logServerInfo } from './config/logger.config';
import { getGlobalPipeConfig } from './config/global.pipes.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const serverPort = configService.get<number>(
    'SERVER_PORT',
    DEFAULT_SERVER_PORT,
  );

  const pipe: ValidationPipe = getGlobalPipeConfig();
  app.useGlobalPipes(pipe);

  const corsConfig: CorsOptions = getCorsConfig(configService);
  app.enableCors(corsConfig);

  const rabbitConfig: RmqOptions = getRabbitConfig(configService);
  app.connectMicroservice<MicroserviceOptions>(rabbitConfig);
  await app.startAllMicroservices();

  await app.listen(serverPort);
  logServerInfo(configService);
}

void bootstrap();
