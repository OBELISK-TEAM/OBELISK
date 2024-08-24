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
import { CanvasActionProperties } from "@/interfaces/canvas-action-properties";

const getProperties = (color: string, size: number): CanvasActionProperties => ({
  color,
  strokeWidth: size,
  fillColor: color,
  fontSize: 20,
  width: size * 10,
  height: size * 5,
  radius: size * 5,
});

const actionHandlers: Record<MenuActions | CanvasMode, CanvasActionHandler> = {
  [CanvasMode.Selection]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setSelectionMode(setCanvasMode);
  },
  [CanvasMode.SimpleDrawing]: ({ canvas, color, size, setCanvasMode }) => {
    if (!canvas || !setCanvasMode) {
      return;
    }
    setDrawingMode(canvas, color as string, size as number, setCanvasMode);
  },
  [CanvasMode.Eraser]: ({ canvas, size, setCanvasMode }) => {
    if (!canvas || !setCanvasMode) {
      return;
    }
    setEraserMode(canvas, size as number, setCanvasMode);
  },
  [MenuActions.AddLine]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    addLine(canvas, properties);
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.AddRectangle]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    addRectangle(canvas, properties);
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.AddCircle]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    addCircle(canvas, properties);
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.AddText]: ({ canvas, properties, setCanvasMode }) => {
    if (!canvas || !properties || !setCanvasMode) {
      return;
    }
    handleAddText(canvas, 50, 50, properties);
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.GroupSelected]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    handleGroupSelected(canvas);
  },
  [MenuActions.RemoveSelected]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    handleRemoveSelected(canvas);
  },
  [MenuActions.ClearCanvas]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    canvas.clear();
  },
  [MenuActions.LoadCanvas]: ({ canvas, setCanvasMode }) => {
    if (!canvas || !setCanvasMode) {
      return;
    }
    handleLoadFromJSON(canvas);
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.AddImageUrl]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.AddImageDisk]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.LoadImagesJson]: ({ setCanvasMode }) => {
    if (!setCanvasMode) {
      return;
    }
    setCanvasMode(CanvasMode.Selection);
  },
  [MenuActions.ChangeColor]: () => {
    // No-op: handled by color picker UI
  },
  [MenuActions.ChangeSize]: () => {
    // No-op: handled by size picker UI
  },
  [MenuActions.ExportPdf]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    exportToPDF(canvas);
  },
  [MenuActions.Undo]: () => {
    // No-op: handled directly in MenuDataContext
  },
  [MenuActions.Redo]: () => {
    // No-op: handled directly in MenuDataContext
  },
  [MenuActions.SaveCanvas]: ({ canvas }) => {
    if (!canvas) {
      return;
    }
    handleSave(canvas);
  },
  [MenuActions.SaveImages]: ({ canvas }) => {
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
