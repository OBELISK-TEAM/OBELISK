import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// extract the user from the request,
// use @User to get the user from the request
// after the user has been authenticated

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user && user[data] : user;
  },
);
