import { CanvasMode } from "@/enums/CanvasMode";

export const isActiveItem = (itemName: string, activeItem: string | null, canvasMode: CanvasMode): boolean => {
  return (
    itemName === activeItem ||
    (itemName === CanvasMode.Selection && canvasMode === CanvasMode.Selection) ||
    (itemName === CanvasMode.SimpleDrawing && canvasMode === CanvasMode.SimpleDrawing) ||
    (itemName === CanvasMode.Eraser && canvasMode === CanvasMode.Eraser)
  );
};

