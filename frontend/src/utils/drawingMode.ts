import { CanvasMode } from "@/enums/CanvasMode";

export const isActiveItem = (
  itemName: string,
  activeItem: string | null,
  canvasMode: CanvasMode
): boolean => {
  return itemName === activeItem || itemName === canvasMode.toString();
};


