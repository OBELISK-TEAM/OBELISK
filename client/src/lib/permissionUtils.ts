import { BoardPermission } from "@/enums/BoardPermission";
import { BoardPermissionNum } from "@/enums/BoardPermissionNum";
import { UserPermissions } from "@/interfaces/user-permissions";
import { PermissionFunctions } from "@/types/permissions/PermissionFunctions";
import { PermissionMap } from "@/types/permissions/PermissionMap";

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

/**
 * Checks if the user's permission is equal to or higher than the required permission.
 */
export const hasPermission = (
  currentPermission: string | undefined,
  requiredPermission: BoardPermissionNum
): boolean => {
  if (!currentPermission) {
    return false;
  }
  if (!Object.values(BoardPermission).includes(currentPermission as BoardPermission)) {
    return false;
  }

  const userPermission = currentPermission as BoardPermission;
  const userPermissionNum = boardPermissionToNum(userPermission);

  return userPermissionNum >= requiredPermission;
};

/**
 * permissionMap defines the hierarchy of permissions.
 *
 * Update this map to change the hierarchy of permissions.
 *
 * To add or delete permissions, modify this map and update
 * corresponding attributes in the UserPermissions interface.
 *
 * note: when modifying, adding, or deleting permissions, the permissionFunctions object should be updated automatically.
 */

const permissionMap: PermissionMap = {
  canEditBoardName: BoardPermissionNum.OWNER,
  canDeleteBoard: BoardPermissionNum.OWNER,
  canControlPermissions: BoardPermissionNum.MODERATOR,
  canViewOtherStats: BoardPermissionNum.MODERATOR,
  canViewOwnStats: BoardPermissionNum.EDITOR,
  canControlSlide: BoardPermissionNum.EDITOR,
  canControlObject: BoardPermissionNum.EDITOR,
  canExportBoard: BoardPermissionNum.VIEWER,
  canViewBoard: BoardPermissionNum.VIEWER,
  canViewBoardDetails: BoardPermissionNum.EDITOR,
};

/**
 * Returns the user's permissions as an object.
 * @param currentPermission - The user's current permission.
 * @returns The user's permissions as an object.
 */
export const getUserPermissions = (currentPermission: string | undefined): UserPermissions => {
  const permissions: Partial<UserPermissions> = {};

  for (const key in permissionMap) {
    const permissionKey = key as keyof UserPermissions;
    permissions[permissionKey] = hasPermission(currentPermission, permissionMap[permissionKey]);
  }
  return permissions as UserPermissions;
};

const generatePermissionFunctions = (map: PermissionMap): PermissionFunctions => {
  const functions = {} as PermissionFunctions;

  (Object.keys(map) as (keyof UserPermissions)[]).forEach((key) => {
    const functionName = key as keyof PermissionFunctions;
    functions[functionName] = (currentPermission: string | undefined) => hasPermission(currentPermission, map[key]);
  });

  return functions;
};

/**
 * permissionFunctions is an object containing functions that check if the user has the required permission.
 * **/
export const permissionFunctions = generatePermissionFunctions(permissionMap);
