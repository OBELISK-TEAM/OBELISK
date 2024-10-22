import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SafeUserDoc } from '../../../shared/interfaces/auth/SafeUserDoc';
import { UserRole } from '../../../shared/enums/user.role';
import {
  MINIMUM_USER_ROLE_KEY,
  REQUIRED_USER_ROLE_KEY,
} from '../decorators/roles.decorator';

// HTTP REST
// @UseGuards(JwtAuthGuard, RoleAuthGuard)
// @MinimumBoardPermission(BoardPermission.VIEWER)

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.getRequiredRole(context);
    const minimumRole = this.getMinimumRole(context);

    if (!requiredRole && !minimumRole) return true;

    const user = this.getUserFromRequest(context);
    this.validateUserRole(user, minimumRole, requiredRole);
    return true;
  }

  private getRequiredRole(context: ExecutionContext): UserRole | undefined {
    return this.reflector.get<UserRole>(
      REQUIRED_USER_ROLE_KEY,
      context.getHandler(),
    );
  }

  private getMinimumRole(context: ExecutionContext): UserRole | undefined {
    return this.reflector.get<UserRole>(
      MINIMUM_USER_ROLE_KEY,
      context.getHandler(),
    );
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
