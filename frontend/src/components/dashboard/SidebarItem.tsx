import React from "react";
import { MenuItem } from "../../interfaces/canva-interfaces";

interface RenderItemProps {
  item: MenuItem;
  activeItem: string | null;
  color: string;
  size: number;
  handleColorChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: (name: string, action?: () => void) => void;
}

const RenderItem: React.FC<RenderItemProps> = ({
  item,
  activeItem,
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
        className={`flex items-center text-left text-gray-600 hover:bg-gray-200 p-2 rounded relative group-hover:w-full hover:text-black ${
          activeItem === item.name ? "bg-gray-200 text-black" : ""
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
            className=" w-6 h-6  border rounded-full"
          />
        ) : (
          item.icon
        )}
        <label
          htmlFor={id}
          className="ml-8 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out group-hover:ml-2 whitespace-nowrap"
          style={{ fontSize: "14px", fontWeight: "500" }}
        >
        {item.name === "change-size" ? "Size" : ""}
          {item.name === "change-size" ? (
            <input
              type="number"
              value={size}
              onChange={handleSizeChange}
              className="ml-2 w-20 p-2 border rounded"
            />
          ) : (
            item.text
          )}
        </label>
      </button>
    </div>
  );
};

export default RenderItem;
