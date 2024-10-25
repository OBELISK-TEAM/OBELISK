"use client";
import { FC } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AppLogo } from "@/components/main-header/AppLogo";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { useMenuData } from "@/contexts/MenuDataContext";
import { MenuItem } from "@/interfaces/menu-data-context";
import { useSocket } from "@/contexts/SocketContext";
import UserInfo from "@/components/main-header/UserInfo";
interface HorizontalMenuProps {
  groupId: string;
}

const BoardHorizontalMenu: FC<HorizontalMenuProps> = ({ groupId }) => {
  const { boardName } = useSocket();
  const {
    state: { activeItem, selectedObjectStyles },
  } = useCanvas();
  const { menuList } = useMenuData();
  const menuItems = menuList.find((group) => group.groupId === groupId);

  return (
    <div className={`flex items-center justify-between border-b bg-background px-4 pl-0`}>
      <div className="flex">
        <button
          onClick={() => {
            window.location.href = "/user-boards"; //i needed to add this, because user was not leaving  the board for some reason
          }}
          className="h-min-[64px] flex h-[64px] w-[3.5em] cursor-pointer items-center justify-center border-r transition-colors hover:bg-muted"
        >
          <AppLogo width={20} height={20} />
        </button>

        <div className="flex flex-shrink-0 items-center border-r px-6">
          <span className="text-lg font-semibold">{boardName}</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto px-4">
          {menuItems?.items.map((item: MenuItem, itemIndex: number) => {
            if (
              !(selectedObjectStyles && selectedObjectStyles.type === "activeSelection") &&
              item.name === MenuActions.GROUP_SELECTED
            ) {
              return null;
            } else if (!selectedObjectStyles && item.name === MenuActions.REMOVE_SELECTED) {
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
                    onClick={() => item.action()}
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
        <UserInfo />
      </div>
    </div>
  );
};

export default BoardHorizontalMenu;
