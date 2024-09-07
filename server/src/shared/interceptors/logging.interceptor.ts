import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const method: string = request.method;
    const url: string = request.url;

    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `${method} ${url} After ... ${Date.now() - now}ms`,
            context.getClass().name,
          ),
        ),
      );
  }
}
