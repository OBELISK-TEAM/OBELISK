import { useCallback, useMemo } from "react";
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
  addText,
  groupSelectedObjects,
  handleLoadFromJSON,
  removeSelectedObjects,
  handleSave,
  saveImagesToLocalFile,
  setDrawingMode,
  setEraserMode,
  setSelectionMode,
} from "@/utils/board/menuDataUtils";
import { CanvasActionProperties } from "@/interfaces/canvas-action-properties";
import { UndoRedoCommand } from "@/interfaces/undo-redo-command";

const getProperties = (color: string, size: number): CanvasActionProperties => ({
  color,
  strokeWidth: size,
  fillColor: color,
  fontSize: 20,
  width: size * 10,
  height: size * 5,
  radius: size * 5,
});

export const useMenuActions = () => {
  const {
    state: { canvas, color, size },
    setCanvasMode,
  } = useCanvas();
  const { saveCommand } = useUndoRedo();

  const actionHandlers: Record<MenuActions | CanvasMode, CanvasActionHandler> = useMemo(() => {
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
        const addedLine = addLine(canvas, properties);
        const command: UndoRedoCommand = {
          undo: () => {
            canvas.remove(addedLine);
          },
          redo: () => {
            canvas.add(addedLine);
          },
        };
        saveCommand(command);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_RECTANGLE]: ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }

        const addedRect = addRectangle(canvas, properties);
        const command: UndoRedoCommand = {
          undo: () => {
            canvas.remove(addedRect);
          },
          redo: () => {
            canvas.add(addedRect);
          },
        };
        saveCommand(command);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_CIRCLE]: ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedCircle = addCircle(canvas, properties);
        const command: UndoRedoCommand = {
          undo: () => {
            canvas.remove(addedCircle);
          },
          redo: () => {
            canvas.add(addedCircle);
          },
        };
        saveCommand(command);
        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_TEXT]: ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedText = addText(canvas, 50, 50, properties);
        const command: UndoRedoCommand = {
          undo: () => {
            canvas.remove(addedText);
          },
          redo: () => {
            canvas.add(addedText);
          },
        };
        saveCommand(command);
        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.GROUP_SELECTED]: ({ canvas }) => {
        if (!canvas) {
          return;
        }
        const activeObjects = canvas.getActiveObjects();
        const group = groupSelectedObjects(canvas);

        if (!group) {
          return;
        }

        const command: UndoRedoCommand = {
          undo: () => {
            canvas.remove(group);
            canvas.add(...activeObjects);
          },
          redo: () => {
            canvas.remove(...activeObjects);
            canvas.add(group);
          },
        };
        saveCommand(command);
      },
      [MenuActions.REMOVE_SELECTED]: ({ canvas }) => {
        if (!canvas) {
          return;
        }
        const removedObjects: fabric.Object[] | undefined = removeSelectedObjects(canvas);
        if (!removedObjects) {
          return;
        }
        const command: UndoRedoCommand = {
          undo: () => {
            canvas.add(...removedObjects);
          },
          redo: () => {
            canvas.remove(...removedObjects);
          },
        };
        saveCommand(command);
      },
      [MenuActions.CLEAR_CANVAS]: ({ canvas }) => {
        if (!canvas) {
          return;
        }
        const allObjects: fabric.Object[] = canvas.getObjects();
        canvas.remove(...allObjects);

        const command: UndoRedoCommand = {
          undo: () => {
            canvas.add(...allObjects);
          },
          redo: () => {
            canvas.remove(...allObjects);
          },
        };
        saveCommand(command);
      },
      [MenuActions.LOAD_CANVAS]: ({ canvas, setCanvasMode }) => {
        if (!canvas || !setCanvasMode) {
          return;
        }
        handleLoadFromJSON(canvas);
        // this action doesn't need a undo/redo command, because it shouldn't be available to a regular user in the final application
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
        // this action doesn't need a undo/redo command, because it shouldn't be available to a regular user in the final application
        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.CHANGE_COLOR]: () => {
        // No-op: handled by color picker UI
        throw new Error(
          "Change () => performAction(MenuActions.CHANGE_COLOR) to () => {} in MenuDataContext - no effect"
        );
      },
      [MenuActions.CHANGE_SIZE]: () => {
        // No-op: handled by size picker UI
        throw new Error(
          "Change () => performAction(MenuActions.CHANGE_SIZE) to () => {} in MenuDataContext - no effect"
        );
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
    return actionHandlers;
  }, [saveCommand]);

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
      }
    },
    [canvas, color, size, actionHandlers, setCanvasMode]
  );

  return { performAction };
};
