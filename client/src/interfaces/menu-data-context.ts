import { MenuActions } from "@/enums/MenuActions";
import { ReactNode } from "react";

export interface MenuDataContext {
  menuList: MenuGroup[];
  performAction: (name: MenuActions) => void;
}

/**
 * If a node is present, the icon should be ignored.
 * If a node is absent, the icon should be used to render a button
 */
export interface MenuItem {
  action: () => void;
  text: string;
  icon: ReactNode;
  node?: ReactNode;
  name: string;
}

export interface MenuGroup {
  groupName: string;
  groupId: string;
  items: MenuItem[];
}

export interface ImageData {
  src: string;
  left: number | undefined;
  top: number | undefined;
  scaleX: number | undefined;
  scaleY: number | undefined;
  angle: number | undefined;
}
