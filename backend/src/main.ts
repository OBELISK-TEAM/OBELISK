import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;
const DEFAULT_CORS_ORIGIN = 'http://localhost:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  const configService = app.get<ConfigService>(ConfigService);
  const host = configService.get<string>('BACKEND_HOST', DEFAULT_HOST);
  const port = configService.get<number>('BACKEND_PORT', DEFAULT_PORT);

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

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('OBELISK')
    .setDescription('OBELISK API description')
    .setVersion('1.0')
    .addTag('obelisk')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(port);
  Logger.log(`Server running on https://${host}:${port}`, 'Bootstrap');
}

void bootstrap();
