"use client";

import React from "react";
import { BarChart2, Info, Shield } from "lucide-react";
import { BoardDetailsSidebarButton } from "@/app/user-boards/(board-management)/[boardId]/_components/board-details-sidebar/BoardDetailsSidebarButton";
import { usePathname } from "next/navigation";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { capabilityFunctions } from "@/lib/permissionUtils";
import { INavItem } from "@/interfaces/sidebar-nav-items";
import { BoardDetailsNavItemLabel } from "@/enums/BoardDetailsNavItemLabel";

interface SidebarContentClientProps {
  boardData?: BoardDetailsResponse;
}

const BoardDetailsSidebarContentClient: React.FC<SidebarContentClientProps> = ({ boardData }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const navItems: INavItem[] = [
    { icon: Info, label: BoardDetailsNavItemLabel.INFORMATION, href: `/user-boards/${boardData?._id}`, enabled: true },
    {
      icon: Shield,
      label: BoardDetailsNavItemLabel.PERMISSIONS,
      href: `/user-boards/${boardData?._id}/permissions`,
      enabled: true,
    },
    {
      icon: BarChart2,
      label: BoardDetailsNavItemLabel.STATISTICS,
      href: `/user-boards/${boardData?._id}/statistics/activity`,
      // if user do not have permission to view own stats and view other stats, disable the statistics tab
      enabled:
        capabilityFunctions.canViewOwnStats(boardData?.permission) ||
        capabilityFunctions.canViewOtherStats(boardData?.permission),
    },
  ];

  const isItemActive = (label: BoardDetailsNavItemLabel): boolean => {
    switch (label) {
      case BoardDetailsNavItemLabel.PERMISSIONS:
        return pathSegments.length === 3 && pathSegments[2] === "permissions";
      case BoardDetailsNavItemLabel.STATISTICS:
        return pathSegments.length >= 3 && pathSegments[2] === "statistics";
      default:
        return pathSegments.length === 2;
    }
  };

  return (
    <nav className="flex flex-col space-y-2 p-2">
      {boardData !== undefined &&
        navItems
          .filter((item) => item.enabled)
          .map((item) => {
            const isActive = isItemActive(item.label);

            return (
              <BoardDetailsSidebarButton key={item.label} href={item.href} isActive={isActive}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.label}
                </span>
              </BoardDetailsSidebarButton>
            );
          })}
    </nav>
  );
};

export default BoardDetailsSidebarContentClient;
