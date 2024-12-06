"use client";
import React from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { CanvasMode } from "@/enums/CanvasMode";
import { MenuItem } from "@/interfaces/menu-data-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BrushConfig } from "@/config/brushConfig";

const isActiveItem = (itemName: string, activeItem: string | null, canvasMode: CanvasMode): boolean => {
  return itemName === activeItem || itemName === canvasMode.toString();
};

interface SidebarItemProps {
  item: MenuItem;
}

const BoardSidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
  const {
    setActiveItem,
    state: { activeItem, color, penSize, eraserSize, canvasMode },
    setColor,
    setPenSize,
    setEraserSize,
  } = useCanvas();
  const handleClick = (name: string, action?: () => void) => {
    if (setActiveItem) {
      setActiveItem(name);
    }
    if (action) {
      action();
    }
  };

  const setSize = (value: number) => {
    if (value < 1 || value > BrushConfig.MAX_BRUSH_SIZE) {
      return;
    }
    if (canvasMode === CanvasMode.SIMPLE_DRAWING) {
      setPenSize(value);
    } else if (canvasMode === CanvasMode.ERASER) {
      setEraserSize(value);
    }
  };
  const size = canvasMode === CanvasMode.SIMPLE_DRAWING ? penSize : canvasMode === CanvasMode.ERASER ? eraserSize : 0;

  return (
    <div>
      <Button
        variant={"mild"}
        className={`flex w-52 justify-normal p-2 text-left ${
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
        <Label
          htmlFor={item.name}
          className="transition-ml ml-8 flex cursor-pointer items-center gap-1 whitespace-nowrap text-sm font-medium duration-300 ease-in-out group-hover:ml-2"
        >
          {item.name === MenuActions.CHANGE_SIZE ? item.text : ""}
          {item.name === MenuActions.CHANGE_SIZE ? (
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value as unknown as number)}
              className="ml-2 w-14 rounded border bg-background p-2 text-muted-foreground"
            />
          ) : (
            item.text
          )}
        </Label>
      </Button>
    </div>
  );
};

export default BoardSidebarItem;
