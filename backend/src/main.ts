import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import 'dotenv/config';

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  Logger.log(`Server running on https://${host}:${port}`, 'Bootstrap');
}

void bootstrap();
