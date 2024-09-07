import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';

// extract the user from the request,
// use @User to get the user from the request
// after the user has been authenticated

interface CustomUser {
  [key: string]: SafeUserDoc;
}

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as CustomUser;
    return data ? user && user[data] : user;
  },
);
