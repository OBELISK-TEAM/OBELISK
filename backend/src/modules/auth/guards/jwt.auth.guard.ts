import {
  Injectable,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../../../enums/user.role';
import { SafeUserDoc } from '../../../shared/interfaces/SafeUserDoc';
import { Request } from 'express';
import {
  MINIMUM_ROLE_KEY,
  REQUIRED_ROLE_KEY,
} from '../decorators/roles.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call the parent canActivate method
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    // Retrieve role information
    const requiredRole = this.getRequiredRole(context);
    const minimumRole = this.getMinimumRole(context);

    // If no role is required, the user is authorized
    if (!requiredRole && !minimumRole) return true;

    const user = this.getUserFromRequest(context);
    this.validateUserRole(user, minimumRole, requiredRole);

    return true;
  }

  private getRequiredRole(context: ExecutionContext): UserRole | undefined {
    return this.reflector.get<UserRole>(
      REQUIRED_ROLE_KEY,
      context.getHandler(),
    );
  }

  private getMinimumRole(context: ExecutionContext): UserRole | undefined {
    return this.reflector.get<UserRole>(MINIMUM_ROLE_KEY, context.getHandler());
  }

  private getUserFromRequest(context: ExecutionContext): SafeUserDoc {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as SafeUserDoc;
  }

  private validateUserRole(
    user: SafeUserDoc,
    minimumRole?: UserRole,
    requiredRole?: UserRole,
  ): void {
    if (minimumRole && user.userRole < minimumRole) {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    }

    if (requiredRole && user.userRole !== requiredRole) {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    }
  }
}
