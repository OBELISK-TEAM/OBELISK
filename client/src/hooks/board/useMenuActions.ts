"use client";
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
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { generateId } from "@/lib/randomUtils";
import { RemoveCommand } from "@/classes/undo-redo-commands/RemoveCommand";
import { ComplexCommand } from "@/classes/undo-redo-commands/ComplexCommand";
import { assignId } from "@/lib/utils";
import { createCanvasObject } from "@/app/actions/slideActions";
import { toast } from "sonner";
import { ToastTypes } from "@/enums/ToastType";
import { complexToast } from "@/contexts/complexToast";
import { ApiError } from "@/errors/ApiError";

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
    boardData: { slide },
  } = useCanvas();
  const { saveCommand } = useUndoRedo();

  const actionHandlers: Record<MenuActions | CanvasMode, CanvasActionHandler> = useMemo(() => {
    const handleSimpleObjectAdding = async (canvas: fabric.Canvas, addedObject: fabric.Object) => {
      if (!slide?._id) {
        toast.error("No slide found");
        return;
      }
      const objectData = addedObject.toJSON();
      try {
        const responseData = await createCanvasObject(slide._id, objectData);
        assignId(addedObject, responseData._id);
        const command = new AddCommand(canvas, addedObject.toJSON(["_id"]));
        saveCommand(command);
      } catch (error: any) {
        console.error("Error while creating object:", error);
        if (error instanceof ApiError) {
          complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
        } else {
          toast.error(error.message || "Failed to create an object");
        }
      }
    };

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
      [MenuActions.ADD_LINE]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedLine = addLine(canvas, properties);
        await handleSimpleObjectAdding(canvas, addedLine);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_RECTANGLE]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedRect = addRectangle(canvas, properties);
        await handleSimpleObjectAdding(canvas, addedRect);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_CIRCLE]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedCircle = addCircle(canvas, properties);
        await handleSimpleObjectAdding(canvas, addedCircle);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_TEXT]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedText = addText(canvas, 50, 50, properties);
        await handleSimpleObjectAdding(canvas, addedText);

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

        const id = generateId("group");
        assignId(group, id);

        const addGroupCommand = new AddCommand(canvas, group.toJSON(["_id"]));
        const removeActiveObjectsCommands = activeObjects.map((obj) => new RemoveCommand(canvas, obj.toJSON(["_id"])));
        const command = new ComplexCommand([addGroupCommand, ...removeActiveObjectsCommands]);
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

        // prepare undo/redo command and save it on the undo/redo stack
        const removeCommands = removedObjects.map((obj) => new RemoveCommand(canvas, obj.toJSON(["_id"])));
        const command = new ComplexCommand(removeCommands);
        saveCommand(command);
      },
      [MenuActions.CLEAR_CANVAS]: ({ canvas }) => {
        if (!canvas) {
          return;
        }
        const allObjects: fabric.Object[] = canvas.getObjects();
        canvas.remove(...allObjects);

        const removeObjectsCommands = allObjects.map((obj) => new RemoveCommand(canvas, obj.toJSON(["_id"])));
        const command = new ComplexCommand(removeObjectsCommands);
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
  }, [saveCommand, slide]);

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
