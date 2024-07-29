import { ReactNode } from 'react';

export interface MenuItem {
  action: () => void;
  text: string;
  icon: ReactNode;
  name: string;
}

export interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export interface DropDownMenuItem {
  text: string;
  icon?: ReactNode;
  action: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: string;
  inputValue: string | number;
}
