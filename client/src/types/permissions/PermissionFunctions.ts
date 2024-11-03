import { UserPermissions } from "@/interfaces/user-permissions";

export type PermissionFunctions = {
  [K in keyof UserPermissions]: (currentPermission: string | undefined) => boolean;
};
