"use client";

import { FC } from "react";
import { Info, Shield, BarChart2 } from "lucide-react";
import { SidebarButton } from "@/components/board-details/SidebarButton";
import { usePathname } from "next/navigation";

interface BoardDetailsSidebarProps {
  boardId: string;
}

const BoardSidebar: FC<BoardDetailsSidebarProps> = ({ boardId }) => {
  const pathname = usePathname();

  const navItems = [
    { icon: Info, label: "Information", href: `/user-boards/${boardId}` },
    { icon: Shield, label: "Permissions", href: `/user-boards/${boardId}/permissions` },
    { icon: BarChart2, label: "Statistics", href: `/user-boards/${boardId}/statistics` },
  ];

  const normalizePath = (path: string) => (path.endsWith("/") ? path.slice(0, -1) : path);

  const currentPath = normalizePath(pathname);

  return (
    <div
      className="transition-width group sticky top-[64px] flex w-14 flex-col justify-between border-r border-border bg-background shadow-md duration-300 ease-in-out hover:w-52"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <nav className="flex flex-col space-y-2 p-2">
        {navItems.map((item) => {
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
    </div>
  );
};

export default BoardSidebar;
