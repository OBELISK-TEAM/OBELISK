import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/errors/ErrorResponse';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();
    const status: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: ErrorResponse = {
      code: status,
      path: request.url,
      method: request.method,
      message: exception.message || null,
      details: exception.getResponse ? exception.getResponse() : null,
    };

    const logMessage = `
Error Code: ${status}
Path: ${request.url}
Method: ${request.method}
Message: ${exception.message}
--------------------------------------------
`;

    this.logger.error(logMessage);

    if (errorResponse.details === null) {
      delete errorResponse.details;
    }

    response.status(status).json(errorResponse);
  }
}
