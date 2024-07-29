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
import {CanvasActions } from "@/enums/CanvasActions";
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
          case CanvasActions.ADD_LINE:
            addLine(canvas, properties);
            setIsDrawingMode(false);
            break;
          case CanvasActions.ADD_RECTANGLE:
            addRectangle(canvas, properties);
            setIsDrawingMode(false);
            break;
          case CanvasActions.ADD_CIRCLE:
            addCircle(canvas, properties);
            setIsDrawingMode(false);
            break;
          case CanvasActions.ADD_TEXT:
            handleAddText(canvas, 50, 50, properties);
            setIsDrawingMode(false);
            break;
          case CanvasActions.GROUP_SELECTED:
            handleGroupSelected(canvas);
            break;
          case CanvasActions.REMOVE_SELECTED:
            handleRemoveSelected(canvas);
            break;
          case CanvasActions.CLEAR_CANVAS:
            canvas?.clear();
            break;
          case CanvasActions.LOAD_CANVAS:
            handleLoadFromJSON(canvas);
            setIsDrawingMode(false);
            break;
          case CanvasActions.ADD_IMAGE_URL:
            setIsDrawingMode(false);
            break;
          case CanvasActions.ADD_IMAGE_DISK:
            setIsDrawingMode(false);
            break;

          case CanvasActions.LOAD_IMAGES_JSON:
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
