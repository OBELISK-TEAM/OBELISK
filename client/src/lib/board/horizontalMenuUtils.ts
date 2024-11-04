import { MenuActions } from "@/enums/MenuActions";
import { MenuItem } from "@/interfaces/menu-data-context";
import { UserActions } from "@/interfaces/user-actions";

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

export const shouldRenderMenuItemBasedOnPermissions = (currentPermission: UserActions, item: MenuItem): boolean => {
  if (item.name === MenuActions.EXPORT_PDF) {
    return currentPermission.canExportBoard;
  }
  return currentPermission.canControlObject;
};
