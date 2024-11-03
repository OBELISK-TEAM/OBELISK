import { MenuActions } from "@/enums/MenuActions";
import { MenuItem } from "@/interfaces/menu-data-context";

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

export const shouldRenderMenuItemBasedOnPermissions = (canControlObject: boolean, item: MenuItem): boolean => {
  if (!canControlObject && item.name !== MenuActions.EXPORT_PDF) {
    return false; // Only allow exporting PDF if user doesn't have control object permission
  }
  return true;
};
