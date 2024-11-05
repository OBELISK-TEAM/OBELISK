import { MenuActions } from "@/enums/MenuActions";
import { MenuItem } from "@/interfaces/menu-data-context";
import { UserCapabilities } from "@/interfaces/user-capabilities";

export const shouldRenderMenuItemBasedOnSelection = (
  selectedObjectStyles: { [p: string]: any } | null,
  item: MenuItem
): boolean => {
  if (
    !(selectedObjectStyles && selectedObjectStyles.type === "activeSelection") &&
    item.name === MenuActions.GROUP_SELECTED
  ) {
    return false;
  } else if (!selectedObjectStyles && item.name === MenuActions.REMOVE_SELECTED) {
    return false;
  }
  return true;
};

export const shouldRenderMenuItemBasedOnPermissions = (userCapabilities: UserCapabilities, item: MenuItem): boolean => {
  if (item.name === MenuActions.EXPORT_PDF) {
    return userCapabilities.canExportBoard;
  }
  if (item.name === MenuActions.SHARE_BOARD) {
    return userCapabilities.canManageUsersPermissions;
  }
  return userCapabilities.canManageObject;
};
