import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as passport from 'passport';
import * as session from 'express-session';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8080;
const DEFAULT_CORS_ORIGIN = '*';
const DEFAULT_SESSION_SECRET = 'default-session-secret';
const DEFAULT_COOKIE_SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

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
    origin: [corsOrigin],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
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


  const passportSessionSecret = configService.get<string>(
    'SESSION_SECRET',
    DEFAULT_SESSION_SECRET,
  );
  const passportCookieSessionMaxAge = configService.get<number>(
    'COOKIE_SESSION_MAX_AGE',
    DEFAULT_COOKIE_SESSION_MAX_AGE,
  );

  console.log(host, port, passportSessionSecret, passportCookieSessionMaxAge);

  app.use(
    session({
      secret: passportSessionSecret,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: Number(passportCookieSessionMaxAge),
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

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
