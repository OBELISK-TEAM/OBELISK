import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_SERVER_HOST = 'localhost';
const DEFAULT_SERVER_PORT = 8080;
const DEFAULT_GW_PORT = 8081;

const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

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
  const gatewayPort = configService.get<number>(
    'SOCKET_GW_PORT',
    DEFAULT_GW_PORT,
  );
  const corsOrigin = configService.get<string>(
    'CORS_ORIGIN',
    DEFAULT_CORS_ORIGIN,
  );

  app.enableCors({
    origin: [corsOrigin], // 'true' for all origins, or an array of allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are properties that are not defined in the DTO
      transform: true, // automatically transforms input data to the expected types based on the DTO
    }),
  );

  await app.listen(serverPort);
  Logger.log(
    `Server running at http://${serverHost}:${serverPort}`,
    'Bootstrap',
  );
  Logger.log(
    `Socket gateway running at ws://${serverHost}:${gatewayPort}/gateway`,
    'Bootstrap',
  );
}

void bootstrap();