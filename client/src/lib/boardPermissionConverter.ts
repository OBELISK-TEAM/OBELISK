// src/utils/BoardPermissionConverter.ts

import { BoardPermission } from "@/enums/BoardPermission";
import { BoardPermissionNum } from "@/enums/BoardPermissionNum";

/**
 * Converts BoardPermission to BoardPermissionNum.
 * @param permission - The BoardPermission enum value.
 * @returns The corresponding BoardPermissionNum enum value.
 */
export const boardPermissionToNum = (permission: BoardPermission): BoardPermissionNum => {
  return BoardPermissionNum[permission];
};

/**
 * Converts BoardPermissionNum to BoardPermission.
 * @param permissionNum - The BoardPermissionNum enum value.
 * @returns The corresponding BoardPermission enum value.
 */
export const boardPermissionFromNum = (permissionNum: BoardPermissionNum): BoardPermission => {
  return BoardPermissionNum[permissionNum] as BoardPermission;
};
