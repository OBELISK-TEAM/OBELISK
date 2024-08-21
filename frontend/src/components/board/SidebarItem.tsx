import React from "react";
import { MenuItem } from "../../interfaces/canva-interfaces";
import { isActiveItem } from "@/utils/isActiveItem";
import { useSlideContext } from "@/contexts/SlideContext";

interface SidebarItemProps {
  item: MenuItem;
}

const BoardSidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const { setActiveItem, activeItem, color, size, canvasMode, setColor, setSize } = useSlideContext();
  const handleClick = (name: string, action?: () => void) => {
    if (setActiveItem) {
      setActiveItem(name);
    }
    if (action) {
      action();
    }
  };
  return (
    <div>
      <button
        className={`flex cursor-pointer items-center rounded p-2 text-left hover:bg-muted hover:text-primary ${
          isActiveItem(item.name, activeItem, canvasMode)
            ? "bg-muted text-primary"
            : "bg-background text-muted-foreground"
        }`}
        onClick={() =>
          !(item.name === "change-color" || item.name === "change-size") && handleClick(item.name, item.action)
        }
      >
        {item.name === "change-color" ? (
          <input
            type="color"
            value={color}
            id={item.name}
            onChange={(e) => setColor(e.target.value)}
            className="h-6 w-6 cursor-pointer rounded-full border"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center">{item.icon}</div>
        )}
        <label
          htmlFor={item.name}
          className="ml-8 cursor-pointer whitespace-nowrap text-sm font-medium transition-all duration-300 ease-in-out group-hover:ml-2 group-hover:opacity-100"
        >
          {item.name === "change-size" ? "Size" : ""}
          {item.name === "change-size" ? (
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value as number)}
              className="ml-2 w-20 cursor-pointer rounded border bg-background p-2 text-muted-foreground"
            />
          ) : (
            item.text
          )}
        </label>
      </button>
    </div>
  );
};

export default BoardSidebarItem;
