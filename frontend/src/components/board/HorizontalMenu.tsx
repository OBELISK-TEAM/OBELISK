"use client";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import ThemeToggle from "../ThemeToggle";
import { AppLogo } from "../AppLogo";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { useMenuData } from "@/contexts/MenuDataContext";
import { MenuItem } from "@/interfaces/menu-data-context";

interface HorizontalMenuProps {
  boardName: string;
  groupId: string;
}

const BoardHorizontalMenu: FC<HorizontalMenuProps> = ({ boardName, groupId }) => {
  const {
    state: { activeItem, selectedObjectStyles },
  } = useCanvas();
  const { menuList } = useMenuData();
  const menuItems = menuList.find((group) => group.groupId === groupId);

  const handleClick = (name: string, action?: () => void) => {
    if (action) {
      action();
    }
  };

  return (
    <div className={`flex items-center justify-between border-b bg-background px-4 pl-0`}>
      <div className="flex">
        <div className="h-min-[64px] flex h-[64px] w-[3.5em] items-center justify-center border-r">
          <AppLogo width={20} height={20} />
        </div>
        <div className="flex flex-shrink-0 items-center border-r px-6">
          <span className="text-lg font-semibold">{boardName}</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto px-4">
          {menuItems?.items.map((item: MenuItem, itemIndex: number) => {
            if (
              !(selectedObjectStyles && selectedObjectStyles.type === "activeSelection") &&
              item.name === MenuActions.GroupSelected
            ) {
              return null;
            } else if (!selectedObjectStyles && item.name === MenuActions.RemoveSelected) {
              return null;
            }
            return (
              <HoverCard key={itemIndex}>
                <HoverCardTrigger asChild>
                  <button
                    className={`flex items-center rounded p-2 ${
                      activeItem === item.name
                        ? "bg-muted text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                    }`}
                    onClick={() => handleClick(item.name, item.action)}
                  >
                    {item.icon}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-40">
                  <p>{item.text}</p>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
      <div className="flex h-[64px] items-center space-x-4 border-l pl-4 pr-2">
        <span className="font-semibold">Anon Anno</span>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default BoardHorizontalMenu;
