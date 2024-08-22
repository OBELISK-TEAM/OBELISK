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
import { MenuActions } from "@/enums/MenuActions";
import { CanvasMode } from "@/enums/CanvasMode";

const useMenuActions = (
  canvas: fabric.Canvas | null,
  color: string,
  size: number,
  saveState: () => void,
  setCanvasMode: (mode: CanvasMode) => void
) => {
  const defaultFontSize = 20;

  const performAction = useCallback(
    (name: MenuActions) => {
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
          case MenuActions.AddLine:
            addLine(canvas, properties);
            setCanvasMode(CanvasMode.Selection);
            break;
          case MenuActions.AddRectangle:
            addRectangle(canvas, properties);
            setCanvasMode(CanvasMode.Selection);
            break;
          case MenuActions.AddCircle:
            addCircle(canvas, properties);
            setCanvasMode(CanvasMode.Selection);
            break;
          case MenuActions.AddText:
            handleAddText(canvas, 50, 50, properties);
            setCanvasMode(CanvasMode.Selection);
            break;
          case MenuActions.GroupSelected:
            handleGroupSelected(canvas);
            break;
          case MenuActions.RemoveSelected:
            handleRemoveSelected(canvas);
            break;
          case MenuActions.ClearCanvas:
            canvas?.clear();
            break;
          case MenuActions.LoadCanvas:
            handleLoadFromJSON(canvas);
            setCanvasMode(CanvasMode.Selection);
            break;
          case MenuActions.AddImageUrl:
            setCanvasMode(CanvasMode.Selection);
            break;
          case MenuActions.AddImageDisk:
            setCanvasMode(CanvasMode.Selection);
            break;

          case MenuActions.LoadImagesJson:
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
