import { LucideIcon } from "lucide-react";
import { BoardDetailsNavItemLabel } from "@/enums/BoardDetailsNavItemLabel";

export interface INavItem {
  icon: LucideIcon;
  label: BoardDetailsNavItemLabel;
  href: string;
  enabled: boolean;
}
