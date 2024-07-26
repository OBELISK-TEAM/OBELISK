import { FC, useState, useRef } from "react";
import { MenuGroup, MenuItem } from "../../interfaces/canva-interfaces";
import { CogIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SidebarItem from "./SidebarItem";

interface BoardSidebarProps {
  menuGroup: MenuGroup;
  onIconClick: (name: string) => void;
  withSettings?: boolean;
  fromRight?: boolean;
  onActiveItemChange?: (activeItem: string | null) => void;
  activeItem: string | null;
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
  color,
  size,
  handleColorChange,
  handleSizeChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

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

  let borderClass = fromRight ? "border-l" : "border-r";

  return (
    <div
      className={`relative flex flex-col bg-white ${borderClass} group hover:w-60 w-[56px] transition-all duration-500 ease-in-out overflow-hidden`}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col flex-1 p-2 space-y-4">
        <div className="grow">
          {menuGroup.items.map((item: MenuItem, itemIndex: number) => (
            <div key={itemIndex}>
              <SidebarItem
                item={item}
                activeItem={activeItem}
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
            <button className="flex items-center text-left text-gray-600 hover:bg-gray-200 p-2 rounded cursor-pointer hover:text-black">
              <CogIcon className="h-5 w-5 flex-shrink-0 cursor-pointer" />
              <span
                className="ml-8  group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap cursor-pointer text-sm font-medium"
              >
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
