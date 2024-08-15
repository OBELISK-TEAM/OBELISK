import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../../enums/user.role';
import { SafeUserDoc } from '../../../shared/interfaces/SafeUserDoc';
import { ROLE_KEY } from '../decorators/roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const canActivate = await super.canActivate(context);

    if (!canActivate) return false;

    const requiredRole = this.reflector.get<UserRole>(
      ROLE_KEY,
      context.getHandler(),
    );

    // if no role is required, then the user is authorized (means no @Role() decorator)
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user: SafeUserDoc = request.user;

    // can switch to greater than or equal to allow for multiple roles
    // if USER is 1, MEMBER is 10, and ADMIN is 100, then
    // if the required role is MEMBER, and the user is ADMIN, it will pass
    // other idea is to provide array of roles, and check if the user has any of the roles
    // let me know if you want me to implement that instead
    if (user.userRole !== requiredRole) {
      throw new HttpException('Forbidden resource', 403);
    }
    return true;
  }
}
