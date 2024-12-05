"use client";
import { FC } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AppLogo } from "@/components/common/headers/main-header/AppLogo";
import { useCanvas } from "@/contexts/CanvasContext";
import { useMenuData } from "@/contexts/MenuDataContext";
import { MenuItem } from "@/interfaces/menu-data-context";
import { useSocket } from "@/contexts/SocketContext";
import UserInfo from "@/components/common/headers/main-header/UserInfo";
import Link from "next/link";
import {
  shouldRenderMenuItemBasedOnPermissions,
  shouldRenderMenuItemBasedOnSelection,
} from "@/lib/board/horizontalMenuUtils";
import { UserCapabilities } from "@/interfaces/user-capabilities";
import { Button } from "../../../../../../../components/ui/button";

interface HorizontalMenuProps {
  groupId: string;
  userCapabilities: UserCapabilities;
}
const BoardHorizontalMenu: FC<HorizontalMenuProps> = ({ groupId, userCapabilities }) => {
  const { boardName, boardId } = useSocket();
  const {
    state: { activeItem, selectedObjectStyles },
  } = useCanvas();
  const { menuList } = useMenuData();
  const menuItems = menuList.find((group) => group.groupId === groupId);

  return (
    <div className={`flex items-center justify-between border-b bg-background px-4 pl-0`}>
      <div className="flex h-full">
        <HoverCard openDelay={100} closeDelay={150}>
          <HoverCardTrigger>
            <Link
              href={"/user-boards"}
              className="h-min-[64px] flex h-[64px] cursor-pointer items-center justify-center gap-2 border-r p-4 transition-colors hover:bg-muted"
            >
              <AppLogo width={15} height={15} />
              <span className={"text-sm font-semibold text-muted-foreground"}>Dashboard</span>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent>Go to dashboard</HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={100} closeDelay={150}>
          <HoverCardTrigger>
            <Link
              href={`/user-boards/${boardId}`}
              className="flex h-full cursor-pointer items-center border-r px-6 hover:bg-muted"
            >
              <span className="font-semibold">{boardName}</span>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent>Go to board details</HoverCardContent>
        </HoverCard>

        <div className="flex items-center space-x-2 overflow-x-auto px-4">
          {menuItems?.items
            .filter((item) => item.enabled)
            .map((item: MenuItem, itemIndex: number) => {
              if (!shouldRenderMenuItemBasedOnPermissions(userCapabilities, item)) {
                return null;
              }
              if (!shouldRenderMenuItemBasedOnSelection(selectedObjectStyles, item)) {
                return null;
              }

              const nodeToShow = item.node ? (
                item.node
              ) : (
                <Button
                  variant="mild"
                  className={`p-2 ${
                    activeItem === item.name
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
                  onClick={() => item.action()}
                >
                  {item.icon}
                </Button>
              );
              return (
                <HoverCard key={itemIndex}>
                  <HoverCardTrigger asChild>{nodeToShow}</HoverCardTrigger>
                  <HoverCardContent className="w-40">
                    <p>{item.text}</p>
                  </HoverCardContent>
                </HoverCard>
              );
            })}
        </div>
      </div>
      <div className="flex h-[64px] items-center space-x-4 border-l pl-4 pr-2">
        <UserInfo withoutLogout={true} />
      </div>
    </div>
  );
};

export default BoardHorizontalMenu;
