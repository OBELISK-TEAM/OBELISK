"use client";

import React from "react";
import { Info, Shield, BarChart2 } from "lucide-react";
import { SidebarButton } from "@/components/board-details/SidebarButton";
import { usePathname } from "next/navigation";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { capabilityFunctions } from "@/lib/permissionUtils";
import { INavItem } from "@/interfaces/sidebar-nav-items";

interface SidebarContentClientProps {
  boardData?: BoardDetailsResponse;
}

const SidebarContentClient: React.FC<SidebarContentClientProps> = ({ boardData }) => {
  const pathname = usePathname();
  const normalizePath = (path: string) => (path.endsWith("/") ? path.slice(0, -1) : path);
  const currentPath = normalizePath(pathname);
  const navItems: INavItem[] = [
    { icon: Info, label: "Information", href: `/user-boards/${boardData?._id}`, enabled: true },
    { icon: Shield, label: "Permissions", href: `/user-boards/${boardData?._id}/permissions`, enabled: true },
    {
      icon: BarChart2,
      label: "Statistics",
      href: `/user-boards/${boardData?._id}/statistics`,
      // if user do not have permission to view own stats and view other stats, disable the statistics tab
      enabled:
        capabilityFunctions.canViewOwnStats(boardData?.permission) ||
        capabilityFunctions.canViewOtherStats(boardData?.permission),
    },
  ];

  return (
    <nav className="flex flex-col space-y-2 p-2">
      {boardData !== undefined &&
        navItems
          .filter((item) => item.enabled)
          .map((item) => {
            const normalizedHref = normalizePath(item.href);
            const isActive = currentPath === normalizedHref;

            return (
              <SidebarButton key={item.label} href={item.href} isActive={isActive}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.label}
                </span>
              </SidebarButton>
            );
          })}
    </nav>
  );
};

export default SidebarContentClient;
