import { MenuActions } from "@/enums/MenuActions";
import { ReactNode } from "react";

export interface IMenuDataContext {
  menuList: MenuGroupI[];
  performAction: (name: MenuActions) => void;
}

export interface MenuItemI {
  action: () => void;
  text: string;
  icon: ReactNode;
  name: string;
}

export interface MenuGroupI {
  groupName: string;
  groupId: string;
  items: MenuItemI[];
}

export interface ImageDataI {
  src: string;
  left: number | undefined;
  top: number | undefined;
  scaleX: number | undefined;
  scaleY: number | undefined;
  angle: number | undefined;
}
