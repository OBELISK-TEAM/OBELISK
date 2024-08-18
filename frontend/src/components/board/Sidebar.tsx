import { FC, useState } from "react";
import { MenuGroup, MenuItem } from "../../interfaces/canva-interfaces";
import { CogIcon } from "lucide-react";

import BoardSidebarItem from "./SidebarItem";
import { CanvasMode } from "@/enums/CanvasMode";

interface BoardSidebarProps {
  menuGroup: MenuGroup;
  onIconClick: (name: string) => void;
  withSettings?: boolean;
  fromRight?: boolean;
  onActiveItemChange?: (activeItem: string | null) => void;
  activeItem: string | null;
  canvasMode: CanvasMode;
  color: string;
  size: number;
  handleColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BoardSidebar: FC<BoardSidebarProps> = ({
  menuGroup,
  onIconClick,
  withSettings = false,
  fromRight = false,
  onActiveItemChange,
  activeItem,
  canvasMode,
  color,
  size,
  handleColorChange,
  handleSizeChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleClick = (name: string, action?: () => void) => {
    if (onActiveItemChange) {
      onActiveItemChange(name);
    }
    if (action) {
      action();
    }
    setSelectedItem(name);
    onIconClick(name);
  };

  const borderClass = fromRight ? "border-l" : "border-r";

  return (
    <div
      className={`relative flex flex-col bg-background ${borderClass} group w-[56px] overflow-hidden transition-all duration-500 ease-in-out hover:w-60`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-1 flex-col space-y-4 p-2">
        <div className="grow">
          {menuGroup.items.map((item: MenuItem, itemIndex: number) => (
            <div key={itemIndex}>
              <BoardSidebarItem
                item={item}
                activeItem={activeItem}
                canvasMode={canvasMode}
                color={color}
                size={size}
                handleColorChange={handleColorChange}
                handleSizeChange={handleSizeChange}
                handleClick={handleClick}
              />
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
