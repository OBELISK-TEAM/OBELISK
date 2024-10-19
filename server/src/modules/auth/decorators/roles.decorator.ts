import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../shared/enums/user.role';

export const REQUIRED_USER_ROLE_KEY = 'required_role';
export const RequiredRole = (role: UserRole) =>
  SetMetadata(REQUIRED_USER_ROLE_KEY, role);

export const MINIMUM_USER_ROLE_KEY = 'minimum_role';
export const MinimumRole = (role: UserRole) =>
  SetMetadata(MINIMUM_USER_ROLE_KEY, role);
