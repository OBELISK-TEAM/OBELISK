"use client";
import { useCallback, useMemo } from "react";
import { CanvasMode } from "@/enums/CanvasMode";
import { MenuActions } from "@/enums/MenuActions";
import { useCanvas } from "@/contexts/CanvasContext";
import { CanvasActionHandler } from "@/types/CanvasActionHandler";
import {
  instantiateCircle,
  instantiateLine,
  instantiateRectangle,
  exportToPDF,
  instantiateText,
  instantiateGroupOfObjects,
  handleLoadFromJSON,
  removeSelectedObjects,
  handleSave,
  saveImagesToLocalFile,
  setDrawingMode,
  setEraserMode,
  setSelectionMode,
} from "@/lib/board/menuDataUtils";
import { CanvasActionProperties } from "@/interfaces/canvas-action-properties";
import { useSocket } from "@/contexts/SocketContext";
import { toast } from "sonner";
import { assignId } from "@/lib/utils";
import { AddObjectData, DeleteObjectData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitAddObject, socketEmitDeleteObject } from "@/lib/board/socketEmitUtils";

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
  // const { saveCommand } = useUndoRedo();
  const { socket } = useSocket();

  const actionHandlers: Record<MenuActions | CanvasMode, CanvasActionHandler> = useMemo(() => {
    const handleSimpleObjectAdding = (canvas: fabric.Canvas, objectToAdd: fabric.Object) => {
      if (!socket) {
        toast.error("No socket found");
        return;
      }

      canvas.add(objectToAdd);
      canvas.setActiveObject(objectToAdd);
      canvas.requestRenderAll();

      const objectData = objectToAdd.toJSON();
      const addObjectData: AddObjectData = {
        object: objectData,
      };

      const callback = (res: any) => {
        assignId(objectToAdd, res._id);
        // const command = new AddCommand(canvas, objectToAdd.toJSON(["_id"]));
        // saveCommand(command);
      };
      socketEmitAddObject(socket, addObjectData, callback);
    };

    const handleObjectDeleting = (canvas: fabric.Canvas, objectToDelete: fabric.Object) => {
      if (!socket) {
        toast.error("No socket found");
        return;
      }

      canvas.remove(objectToDelete);

      const deleteObjectData: DeleteObjectData = {
        // @ts-expect-error Object has to have _id
        object: { _id: objectToDelete._id },
      };

      socketEmitDeleteObject(socket, deleteObjectData);
      // const command = new RemoveCommand(canvas, objectToAdd.toJSON(["_id"]));
      // saveCommand(command);
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
        const addedLine = instantiateLine(canvas, properties);
        handleSimpleObjectAdding(canvas, addedLine);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_RECTANGLE]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedRect = instantiateRectangle(canvas, properties);
        handleSimpleObjectAdding(canvas, addedRect);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_CIRCLE]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedCircle = instantiateCircle(canvas, properties);
        handleSimpleObjectAdding(canvas, addedCircle);

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.ADD_TEXT]: async ({ canvas, properties, setCanvasMode }) => {
        if (!canvas || !properties || !setCanvasMode) {
          return;
        }
        const addedText = instantiateText(canvas, 50, 50, properties);

        handleSimpleObjectAdding(canvas, addedText);
        addedText.enterEditing();
        addedText.selectAll();

        setCanvasMode(CanvasMode.SELECTION);
      },
      [MenuActions.GROUP_SELECTED]: ({ canvas }) => {
        if (!canvas) {
          return;
        }
        const activeObjects = canvas.getActiveObjects();
        const group = instantiateGroupOfObjects(canvas, activeObjects);
        if (!group) {
          return;
        }

        handleSimpleObjectAdding(canvas, group);
        activeObjects.forEach((obj) => handleObjectDeleting(canvas, obj));

        // const addGroupCommand = new AddCommand(canvas, group.toJSON(["_id"]));
        // const removeActiveObjectsCommands = activeObjects.map((obj) => new RemoveCommand(canvas, obj.toJSON(["_id"])));
        // const command = new ComplexCommand([addGroupCommand, ...removeActiveObjectsCommands]);
        // saveCommand(command);
      },
      [MenuActions.REMOVE_SELECTED]: ({ canvas }) => {
        if (!canvas) {
          return;
        }
        const removedObjects: fabric.Object[] | undefined = removeSelectedObjects(canvas);
        if (!removedObjects) {
          return;
        }

        removedObjects.forEach((obj) => {
          handleObjectDeleting(canvas, obj);
        });
      },
      [MenuActions.CLEAR_CANVAS]: ({ canvas }) => {
        if (!canvas || !socket) {
          return;
        }
        const allObjects: fabric.Object[] = canvas.getObjects();
        canvas.remove(...allObjects);

        allObjects.forEach((obj) => {
          const deleteObjectData: DeleteObjectData = {
            // @ts-expect-error Every fabric object should have _id
            object: { _id: obj._id },
          };
          socketEmitDeleteObject(socket, deleteObjectData);
        });

        // const removeObjectsCommands = allObjects.map((obj) => new RemoveCommand(canvas, obj.toJSON(["_id"])));
        // const command = new ComplexCommand(removeObjectsCommands);
        // saveCommand(command);
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
  }, [socket]);

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
