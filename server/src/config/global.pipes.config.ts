import { ValidationPipe } from '@nestjs/common';

export function getGlobalPipeConfig(): ValidationPipe {
  return new ValidationPipe({
    // removes properties that are not defined in the DTO
    whitelist: true,

    // throws an error if there are properties that are not defined in the DTO
    forbidNonWhitelisted: true,

    // automatically transforms input data to the expected types based on the DTO
    transform: true,

    transformOptions: {
      // enable implicit conversion of input data to the expected types based on the DTO
      enableImplicitConversion: true,
    },
  });
}
