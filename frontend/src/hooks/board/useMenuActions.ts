import { useCallback } from "react";
import { CanvasMode } from "@/enums/CanvasMode";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { useUndoRedo } from "@/contexts/UndoRedoContext";
import { CanvasActionHandler } from "@/types/CanvasActionHandler";
import {
  addCircle,
  addLine,
  addRectangle,
  exportToPDF,
  handleAddText,
  handleGroupSelected,
  handleLoadFromJSON,
  handleRemoveSelected,
  handleSave,
  saveImagesToLocalFile,
  setDrawingMode,
  setEraserMode,
  setSelectionMode,
} from "@/utils/board/menuDataUtils";
import { CanvasActionPropertiesI } from "@/interfaces/canvas-action-properties";

const getProperties = (color: string, size: number): CanvasActionPropertiesI => ({
  color,
  strokeWidth: size,
  fillColor: color,
  fontSize: 20,
  width: size * 10,
  height: size * 5,
  radius: size * 5,
});

const actionHandlers: Record<MenuActions | CanvasMode, CanvasActionHandler> = {
  [CanvasMode.SELECTION]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setSelectionMode(setCanvasMode);
  },
  [CanvasMode.SIMPLE_DRAWING]: ({ canvas, color, size, setCanvasMode }) => {
    if (!canvas || !setCanvasMode) {
      return;
    }
    setDrawingMode(canvas, color as string, size as number, setCanvasMode);
  },
  [CanvasMode.ERASER]: ({ canvas, size, setCanvasMode }) => {
    if (!canvas || !setCanvasMode) {
      return;
    }
    setEraserMode(canvas, size as number, setCanvasMode);
  },
  [MenuActions.ADD_LINE]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    addLine(canvas, properties);
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.ADD_RECTANGLE]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    addRectangle(canvas, properties);
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.ADD_CIRCLE]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    addCircle(canvas, properties);
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.ADD_TEXT]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    handleAddText(canvas, 50, 50, properties);
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.GROUP_SELECTED]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    handleGroupSelected(canvas);
  },
  [MenuActions.REMOVE_SELECTED]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    handleRemoveSelected(canvas);
  },
  [MenuActions.CLEAR_CANVAS]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    canvas.clear();
  },
  [MenuActions.LOAD_CANVAS]: ({ canvas, setCanvasMode }) => {
    if (!canvas || !setCanvasMode) {
      return;
    }
    handleLoadFromJSON(canvas);
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.ADD_IMAGE_URL]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.ADD_IMAGE_DISK]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.LOAD_IMAGES_JSON]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setCanvasMode(CanvasMode.SELECTION);
  },
  [MenuActions.CHANGE_COLOR]: () => {
    // No-op: handled by color picker UI
    throw new Error("Change () => performAction(MenuActions.CHANGE_COLOR) to () => {} in MenuDataContext - no effect");
  },
  [MenuActions.CHANGE_SIZE]: () => {
    // No-op: handled by size picker UI
    throw new Error("Change () => performAction(MenuActions.CHANGE_SIZE) to () => {} in MenuDataContext - no effect");
  },
  [MenuActions.EXPORT_PDF]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    exportToPDF(canvas);
  },
  [MenuActions.UNDO]: () => {
    // No-op: handled directly in MenuDataContext
    throw new Error(
      "Change () => performAction(MenuActions.UNDO) to undo() - it should be called directly in MenuDataContext"
    );
  },
  [MenuActions.REDO]: () => {
    // No-op: handled directly in MenuDataContext
    throw new Error(
      "Change () => performAction(MenuActions.REDO) to redo() - it should be called directly in MenuDataContext"
    );
  },
  [MenuActions.SAVE_CANVAS]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    handleSave(canvas);
  },
  [MenuActions.SAVE_IMAGES]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    saveImagesToLocalFile(canvas);
  },
};

export const useMenuActions = () => {
  const {
    state: { canvas, color, size },
    setCanvasMode,
  } = useCanvas();
  const { saveState } = useUndoRedo();

  const performAction = useCallback(
    (name: MenuActions | CanvasMode) => {
      const properties = getProperties(color, size);
      const handler = actionHandlers[name];
      if (handler) {
        handler({
          canvas,
          properties,
          setCanvasMode,
          color,
          size,
        });
        saveState();
      }
    },
    [canvas, color, size, saveState, setCanvasMode]
  );

  return { performAction };
};
