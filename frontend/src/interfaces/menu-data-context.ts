import { MenuActions } from "@/enums/MenuActions";
import { ReactNode } from "react";

export interface IMenuDataContext {
  menuList: MenuGroup[];
  performAction: (name: MenuActions) => void;
}

export interface MenuItem {
  action: () => void;
  text: string;
  icon: ReactNode;
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
