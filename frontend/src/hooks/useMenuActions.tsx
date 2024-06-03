import { Dispatch, SetStateAction, useCallback } from "react";
import { fabric } from "fabric";
import {
  addLine,
  addRectangle,
  addCircle,
  handleAddText,
  handleGroupSelected,
  handleRemoveSelected,
  handleLoadFromJSON,
} from "@/lib/fabricCanvasUtils";

const useMenuActions = (
  canvas: fabric.Canvas | null,
  color: string,
  size: number,
  saveState: () => void,
  setIsDrawingMode: Dispatch<SetStateAction<boolean>>
) => {
  const defaultFontSize = 20;

  const performAction = useCallback(
    (name: string) => {
      const properties = {
        color,
        strokeWidth: size,
        fillColor: color,
        fontSize: defaultFontSize,
        width: size * 10,
        height: size * 5,
        radius: size * 5,
      };
      if (name) {
        switch (name) {
          case "add-line":
            addLine(canvas, properties);
            setIsDrawingMode(false);
            break;
          case "add-rectangle":
            addRectangle(canvas, properties);
            setIsDrawingMode(false);
            break;
          case "add-circle":
            addCircle(canvas, properties);
            setIsDrawingMode(false);
            break;
          case "add-text":
            handleAddText(canvas, 50, 50, properties);
            setIsDrawingMode(false);
            break;
          case "group-selected":
            handleGroupSelected(canvas);
            break;
          case "remove-selected":
            handleRemoveSelected(canvas);
            break;
          case "clear-canvas":
            canvas?.clear();
            break;
          case "load-canvas":
            handleLoadFromJSON(canvas);
            setIsDrawingMode(false);
            break;
          case "add-image-url":
            setIsDrawingMode(false);
            break;
          case "add-image-disk":
            setIsDrawingMode(false);
            break;

          case "load-images-json":
            setIsDrawingMode(false);
            break;
          default:
            break;
        }

        saveState();
      }
    },
    [canvas, color, size, saveState, setIsDrawingMode]
  );

  return performAction;
};

export default useMenuActions;
