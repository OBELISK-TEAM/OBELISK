import React from "react";
import { MenuItem } from "../../interfaces/canva-interfaces";
import { MenuAction } from "@/enums/MenuActions";

interface SidebarItemProps {
  item: MenuItem;
  activeItem: string | null;
  isDrawingMode: boolean,
  color: string;
  size: number;
  handleColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (name: string, action?: () => void) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  activeItem,
  isDrawingMode,
  color,
  size,
  handleColorChange,
  handleSizeChange,
  handleClick,
}) => {
  const id = item.name;
  return (
    <div>
      <button
        className={`flex items-center text-left text-gray-600 hover:bg-gray-200 p-2 rounded cursor-pointer ${
          activeItem === item.name ||
          (item.name === MenuAction.SelectionMode && !isDrawingMode) ||
          (item.name === MenuAction.DrawingMode && isDrawingMode)
            ? "bg-gray-200 text-black"
            : ""
        }`}
        onClick={() =>
          !(item.name === "change-color" || item.name === "change-size") &&
          handleClick(item.name, item.action)
        }
      >
        {item.name === "change-color" ? (
          <input
            type="color"
            value={color}
            id={id}
            onChange={handleColorChange}
            className="w-6 h-6 border rounded-full cursor-pointer"
          />
        ) : (
          <div className="h-6 w-6 flex items-center justify-center">{item.icon}</div>
        )}
        <label
          htmlFor={id}
          className="ml-8  group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap cursor-pointer text-sm font-medium"
        >
          {item.name === "change-size" ? "Size" : ""}
          {item.name === "change-size" ? (
            <input
              type="number"
              value={size}
              onChange={handleSizeChange}
              className="ml-2 w-20 p-2 border rounded cursor-pointer"
            />
          ) : (
            item.text
          )}
        </label>
      </button>
    </div>
  );
};

export default SidebarItem;