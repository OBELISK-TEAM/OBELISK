import { BoardPermission } from "@/enums/BoardPermission";
import { BoardPermissionNum } from "@/enums/BoardPermissionNum";
import { UserActions } from "@/interfaces/user-actions";
import { ActionFunctions } from "@/types/permissions/ActionFunctions";
import { ActionPermissionMap } from "@/types/permissions/ActionPermissionMap";

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
 * actionPermissionMap defines the minimum permissions required for each action.
 * For example, `canViewBoard` requires the user to have at least VIEWER permissions.
 *
 * The permission hierarchy is defined in BoardPermissionNum (higher numbers indicate more permissions).
 * Update this map to adjust the hierarchy of permissions.
 *
 * To add or remove permissions, modify this map and update the corresponding attributes
 * in the `UserPermissions` interface.
 *
 * Note: When modifying, adding, or deleting permissions, the actionFunctions object
 * should update automatically.
 */

const actionPermissionMap: ActionPermissionMap = {
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
export const getUserActions = (currentPermission: string | undefined): UserActions => {
  const actions: Partial<UserActions> = {};

  for (const key in actionPermissionMap) {
    const actionKey = key as keyof UserActions;
    actions[actionKey] = hasPermission(currentPermission, actionPermissionMap[actionKey]);
  }
  return actions as UserActions;
};

const generateActionFunctions = (map: ActionPermissionMap): ActionFunctions => {
  const functions = {} as ActionFunctions;

  (Object.keys(map) as (keyof UserActions)[]).forEach((key) => {
    const functionName = key as keyof ActionFunctions;
    functions[functionName] = (currentPermission: string | undefined) => hasPermission(currentPermission, map[key]);
  });

  return functions;
};

/**
 * actionFunctions is an object containing functions that check if the user has the required permission for given action.
 * **/
export const actionFunctions = generateActionFunctions(actionPermissionMap);
