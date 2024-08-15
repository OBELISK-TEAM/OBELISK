import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../../enums/user.role';
import { SafeUserDoc } from '../../../shared/interfaces/SafeUserDoc';
import { ROLE_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // parent canActivate method
    const canActivate = await super.canActivate(context);

    if (!canActivate) return false;

    // check if controller or handler has @Role() decorator
    // (custom canActivate method)
    const requiredRole = this.reflector.get<UserRole>(
      ROLE_KEY,
      context.getHandler(),
    );

    // if no role is required, then the user is authorized
    // - means no @Role() decorator
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as SafeUserDoc;

    // can switch to greater than or equal to allow for multiple roles
    // if USER is 1, MEMBER is 10, and ADMIN is 100, then
    // if the required role is MEMBER, and the user is ADMIN, it will pass
    // other idea is to provide array of roles, and check if the user has any of the roles
    if (user.userRole !== requiredRole)
      throw new HttpException('Forbidden resource', 403);

    return true;
  }
}
