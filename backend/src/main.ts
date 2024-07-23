import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const host = configService.get<string>('BACKEND_HOST', 'localhost');
  const port = configService.get<number>('BACKEND_PORT', 8080);

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes properties that are not defined in the DTO
      forbidNonWhitelisted: true, // throws an error if there are properties that are not defined in the DTO
      transform: true, // automatically transforms input data to the expected types based on the DTO
    }),
  );

  await app.listen(port);
  Logger.log(`Server running on https://${host}:${port}`, 'Bootstrap');
}

void bootstrap();
