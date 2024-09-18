import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../../enums/user.role';

export const REQUIRED_ROLE_KEY = 'required_role';
export const RequiredRole = (role: UserRole) =>
  SetMetadata(REQUIRED_ROLE_KEY, role);

export const MINIMUM_ROLE_KEY = 'minimum_role';
export const MinimumRole = (role: UserRole) =>
  SetMetadata(MINIMUM_ROLE_KEY, role);