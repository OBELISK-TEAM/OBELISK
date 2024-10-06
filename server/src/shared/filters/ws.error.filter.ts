import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ValidationError } from '../interfaces/errors/ValidationError';

@Catch(WsException, HttpException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = this.getError(exception);

    const message = this.formatErrorMessage(error);
    client.emit('error', { message });
    this.logger.error(message);
  }

  private getError(exception: WsException | HttpException): ValidationError {
    if (exception instanceof WsException) {
      const errorResponse = exception.getError();
      if (typeof errorResponse === 'string') {
        return { message: errorResponse };
      }
      return errorResponse as ValidationError;
    } else {
      {
        const errorResponse = exception.getResponse();
        {
          if (typeof errorResponse === 'string') {
            return { message: errorResponse };
          }
          return errorResponse as ValidationError;
        }
      }
    }
  }

  private formatErrorMessage(error: ValidationError): string {
    if (typeof error.message === 'string') {
      return this.capitalize(error.message);
    } else if (Array.isArray(error.message)) {
      return error.message.map(msg => this.capitalize(msg)).join(', ');
    }
    return 'An unknown error occurred';
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
