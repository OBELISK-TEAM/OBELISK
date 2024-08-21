"use client";
import { FC } from "react";
import { CogIcon } from "lucide-react";
import BoardSidebarItem from "./SidebarItem";
import { useSlideContext } from "@/contexts/SlideContext";

interface BoardSidebarProps {
  groupId: string;
  withSettings?: boolean;
  fromRight?: boolean;
}

const BoardSidebar: FC<BoardSidebarProps> = ({ withSettings = false, groupId, fromRight = false }) => {
  const { menuList } = useSlideContext();
  const borderClass = fromRight ? "border-l" : "border-r";
  const menuGroup = menuList.find((group) => group.groupId === groupId);
  return (
    <div
      className={`relative flex flex-col bg-background ${borderClass} group w-[56px] overflow-hidden transition-all duration-500 ease-in-out hover:w-60`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-1 flex-col space-y-4 p-2">
        <div className="grow">
          {menuGroup?.items.map((item, itemIndex) => (
            <div key={itemIndex}>
              <BoardSidebarItem item={item} />
            </div>
          ))}
        </div>
        {withSettings && (
          <div className="border-t pt-3">
            <button className="flex cursor-pointer items-center rounded p-2 text-left text-muted-foreground hover:bg-muted hover:text-primary">
              <CogIcon className="h-5 w-5 flex-shrink-0 cursor-pointer" />
              <span className="ml-8 cursor-pointer whitespace-nowrap text-sm font-medium transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100">
                Settings
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardSidebar;
