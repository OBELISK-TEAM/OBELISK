import { FC } from "react";
import { Info, Shield, BarChart2 } from "lucide-react";
import { SidebarButton } from "@/components/board-details/SidebarButton";

interface BoardDetailsSidebarProps {
  boardId: string;
}

const BoardSidebar: FC<BoardDetailsSidebarProps> = ({ boardId }) => {
  const navItems = [
    { icon: Info, label: "Information", href: `/user-boards/${boardId}` },
    { icon: Shield, label: "Permissions", href: `/user-boards/${boardId}/permissions` },
    { icon: BarChart2, label: "Statistics", href: `/user-boards/${boardId}/statistics` },
  ];
  return (
    <div
      className="transition-width group flex w-14 flex-col justify-between border-r border-border bg-background shadow-md duration-300 ease-in-out hover:w-52"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <nav className="flex flex-col space-y-2 p-2">
        {navItems.map((item) => (
          <SidebarButton key={item.label} href={item.href}>
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.label}
            </span>
          </SidebarButton>
        ))}
      </nav>
    </div>
  );
};
export default BoardSidebar;
