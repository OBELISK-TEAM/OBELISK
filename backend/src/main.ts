import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const host = process.env.BACKEND_HOST || 'localhost';
const port = process.env.BACKEND_PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
