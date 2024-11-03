import { MenuActions } from "@/enums/MenuActions";
import { MenuItem } from "@/interfaces/menu-data-context";
import { UserPermissions } from "@/interfaces/user-permissions";

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

export const shouldRenderMenuItemBasedOnPermissions = (currentPermission: UserPermissions, item: MenuItem): boolean => {
  if (currentPermission.canExportBoard && item.name === MenuActions.EXPORT_PDF) {
    return true;
  } else if (!currentPermission.canControlObject) {
    return false;
  }
  return true;
};
