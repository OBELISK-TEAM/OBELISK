import { Dispatch, SetStateAction, useCallback } from "react";
import { fabric } from "fabric";
import {
  addCircle,
  addLine,
  addRectangle,
  handleAddText,
  handleGroupSelected,
  handleLoadFromJSON,
  handleRemoveSelected,
} from "@/utils/fabricCanvasUtils";
import { CanvasActions } from "@/enums/CanvasActions";
import { CanvasMode } from "@/enums/CanvasMode";

const useMenuActions = (
  canvas: fabric.Canvas | null,
  color: string,
  size: number,
  saveState: () => void,
  setCanvasMode: Dispatch<SetStateAction<CanvasMode>>
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
            setCanvasMode(CanvasMode.Selection);
            break;
          case CanvasActions.ADD_RECTANGLE:
            addRectangle(canvas, properties);
            setCanvasMode(CanvasMode.Selection);
            break;
          case CanvasActions.ADD_CIRCLE:
            addCircle(canvas, properties);
            setCanvasMode(CanvasMode.Selection);
            break;
          case CanvasActions.ADD_TEXT:
            handleAddText(canvas, 50, 50, properties);
            setCanvasMode(CanvasMode.Selection);
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
            setCanvasMode(CanvasMode.Selection);
            break;
          case CanvasActions.ADD_IMAGE_URL:
            setCanvasMode(CanvasMode.Selection);
            break;
          case CanvasActions.ADD_IMAGE_DISK:
            setCanvasMode(CanvasMode.Selection);
            break;

          case CanvasActions.LOAD_IMAGES_JSON:
            setCanvasMode(CanvasMode.Selection);
            break;
          default:
            break;
        }

        saveState();
      }
    },
    [canvas, color, size, saveState, setCanvasMode]
  );

  return performAction;
};

export default useMenuActions;
