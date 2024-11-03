import { BoardPermission } from "@/enums/BoardPermission";
import { BoardPermissionNum } from "@/enums/BoardPermissionNum";
import { UserPermissions } from "@/interfaces/user-permissions";
import { PermissionMap } from "@/types/PermissionMap";

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
 * This map will define hierarchy of permissions.
 *
 * If we update the hierarchy of permissions, we will need to change this map.
 *
 * If we want to add/delete a permission, we will need to change this map and add/delete
 * the corresponding permission in the UserPermissions interface.
 */
export const permissionMap: PermissionMap = {
  canEditBoardName: BoardPermissionNum.OWNER,
  canDeleteBoard: BoardPermissionNum.OWNER,
  canAssignPermissions: BoardPermissionNum.MODERATOR,
  canViewOtherStats: BoardPermissionNum.MODERATOR,
  canViewOwnStats: BoardPermissionNum.EDITOR,
  canControlSlide: BoardPermissionNum.EDITOR,
  canControlObject: BoardPermissionNum.EDITOR,
  canExportBoard: BoardPermissionNum.VIEWER,
  canViewBoard: BoardPermissionNum.VIEWER,
};
export const getUserPermissions = (currentPermission: string | undefined): UserPermissions => {
  const permissions: Partial<UserPermissions> = {};

  for (const key in permissionMap) {
    const permissionKey = key as keyof UserPermissions;
    permissions[permissionKey] = hasPermission(currentPermission, permissionMap[permissionKey]);
  }
  return permissions as UserPermissions;
};

export const hasPermissionToEditBoardName = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canEditBoardName);
};

export const hasPermissionToDeleteBoard = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canDeleteBoard);
};

export const hasPermissionToAssignPermissions = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canAssignPermissions);
};

export const hasPermissionToViewOtherStats = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canViewOtherStats);
};

export const hasPermissionToViewOwnStats = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canViewOwnStats);
};

export const hasPermissionToControlSlide = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canControlSlide);
};

export const hasPermissionToControlObject = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canControlObject);
};

export const hasPermissionToExportBoard = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canExportBoard);
};

export const hasPermissionToViewBoard = (currentPermission: string | undefined): boolean => {
  return hasPermission(currentPermission, permissionMap.canViewBoard);
};
