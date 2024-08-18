import { FC } from "react";
import { MenuGroup , MenuItem } from "../../interfaces/canva-interfaces";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import ThemeToggle from "../ThemeToggle";

interface HorizontalMenuProps {
  menuItem: MenuGroup;
  onIconClick: (name: string) => void;
  withSettings?: boolean;
  fromRight?: boolean;
  boardName: string;
  onActiveItemChange?: (activeItem: string | null) => void;
  activeItem: string | null;
  activeCanvasObject: { [key: string]: any } | null;
}

const HorizontalMenu: FC<HorizontalMenuProps> = ({
  menuItem,
  onIconClick,
  boardName,
  onActiveItemChange,
  activeItem,
  activeCanvasObject,
}) => {
  const handleClick = (name: string, action?: () => void) => {
    if (onActiveItemChange) {
      onActiveItemChange(name);
    }
    if (action) {
      action();
    }
    onIconClick(name);
  };

  return (
    <div
      className={`flex items-center justify-between  px-4 bg-background border-b pl-0`}
    >
      <div className="flex">
        <div className="border-r flex items-center justify-center h-[64px] h-min-[64px] w-[3.5em]">
          <Image src="/best-logo-lite.png" alt="Logo" width={20} height={20} />
        </div>
        <div className="flex-shrink-0  flex items-center border-r px-6">
          <span className="text-lg font-semibold">{boardName}</span>
        </div>
        <div className="flex items-center overflow-x-auto space-x-2 px-4">
          {menuItem.items.map((item: MenuItem, itemIndex: number) => {
            if(!(activeCanvasObject && activeCanvasObject.type === 'activeSelection') && (item.name === 'group-selected')) return null;
            else if(!(activeCanvasObject) && (item.name === 'remove-selected')) return null;
            return (
                <HoverCard key={itemIndex}>
              <HoverCardTrigger asChild>
                <button
                  className={`flex items-center p-2 rounded ${
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
            </HoverCard>);
          })}
        </div>
      </div>
      <div className="flex items-center space-x-4 border-l pr-2 pl-4 h-[64px]">
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

export default HorizontalMenu;
