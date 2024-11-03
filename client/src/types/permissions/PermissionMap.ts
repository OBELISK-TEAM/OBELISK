import { BoardPermissionNum } from "@/enums/BoardPermissionNum";
import { UserPermissions } from "@/interfaces/user-permissions";

export type PermissionMap = {
  [K in keyof UserPermissions]: BoardPermissionNum;
};
