import { LucideIcon } from "lucide-react";

export interface INavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  enabled: boolean;
}
