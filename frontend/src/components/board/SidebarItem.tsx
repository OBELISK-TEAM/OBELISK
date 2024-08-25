"use client";
import React from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { CanvasMode } from "@/enums/CanvasMode";
import { MenuItem } from "@/interfaces/menu-data-context";

const isActiveItem = (itemName: string, activeItem: string | null, canvasMode: CanvasMode): boolean => {
  return itemName === activeItem || itemName === canvasMode.toString();
};

interface SidebarItemProps {
  item: MenuItem;
}

const BoardSidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const {
    setActiveItem,
    state: { activeItem, color, size, canvasMode },
    setColor,
    setSize,
  } = useCanvas();
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
          !(item.name === MenuActions.CHANGE_COLOR || item.name === MenuActions.CHANGE_SIZE) &&
          handleClick(item.name, item.action)
        }
      >
        {item.name === MenuActions.CHANGE_COLOR ? (
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
          {item.name === MenuActions.CHANGE_SIZE ? "Size" : ""}
          {item.name === MenuActions.CHANGE_SIZE ? (
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value as unknown as number)}
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
