import { useEffect, useReducer } from "react";
import { fabric } from "fabric";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { getJsonWithAbsoluteProperties } from "@/utils/board/undoRedoUtils";

import { canvasEventListenersReducer, initialState } from "@/reducers/canvasEventListenersReducer";
import { toast } from "sonner";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import { ApiError } from "@/errors/ApiError";
import { useSocket } from "@/contexts/SocketContext";
import { AddObjectData, UpdateObjectData } from "@/interfaces/socket/SocketEmitsData";
import { assignId } from "@/utils/utils";

const useCanvasEventHandlers = (
  canvas: fabric.Canvas | null,
  saveCommand: (command: any) => void,
  handleStyleChange: () => void,
  slideId: string
) => {
  const [state, dispatch] = useReducer(canvasEventListenersReducer, initialState);
  const { socket, socketEmitAddObject, socketEmitUpdateObject } = useSocket();

  useEffect(() => {
    if (!canvas || !socket) {
      return;
    }

    const handlePathCreated = async (e: any) => {
      if (!e.path || !canvas.contains(e.path)) {
        return;
      }
      try {
        const objectData = e.path.toJSON();
        const addObjectData: AddObjectData = {
          object: objectData,
          slide: { _id: slideId },
        };

        const callback = (res: string) => {
          assignId(e.path, res);
          const command = new AddCommand(canvas, e.path.toJSON(["_id"]));
          saveCommand(command);
        };
        socketEmitAddObject(addObjectData, callback);
      } catch (error: any) {
        console.error("Error while creating object:", error);
        if (error instanceof ApiError) {
          complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
        } else {
          toast.error(error.message || "Failed to create an object");
        }
      }
    };

    const handleActiveSelectionModification = () => {
      const activeObjects: fabric.Object[] = canvas.getActiveObjects();
      if (activeObjects.length <= 1) {
        return;
      }

      const activeObjectsJSONs = activeObjects.map((obj) => getJsonWithAbsoluteProperties(obj));

      for (const activeObjectJSON of activeObjectsJSONs) {
        const updateObjectData: UpdateObjectData = {
          object: activeObjectJSON,
        };
        socketEmitUpdateObject(updateObjectData);
      }

      // const commands = activeObjectsJSONs.map((activeObjectJSON, i) => {
      //   const recentlyActiveObjectJSON = state.recentlyActiveObjects[i];
      //   return new ModifyCommand(canvas, recentlyActiveObjectJSON, activeObjectJSON, handleStyleChange);
      // });

      // saveCommand(new ComplexCommand(commands));
    };

    const handleObjectModified = (e: fabric.IEvent) => {
      if (e.target?.type === "activeSelection") {
        handleActiveSelectionModification();
        return;
      }

      const oldValues = e.transform?.original;
      const target = e.target;

      if (!oldValues || !target) {
        return;
      }

      const targetJSON = target.toJSON(["_id"]);
      // const clonedJSON = { ...targetJSON, ...oldValues };

      const updateObjectData: UpdateObjectData = {
        object: targetJSON,
      };
      socketEmitUpdateObject(updateObjectData);
      // const command = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
      // saveCommand(command);

      handleStyleChange();
    };

    const handleMultipleSelections = () => {
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length <= 1) {
        return;
      }

      const activeObjectsJSONs = activeObjects.map((obj) => getJsonWithAbsoluteProperties(obj));
      dispatch({ type: "SET_RECENTLY_ACTIVE_OBJECTS", payload: activeObjectsJSONs });
    };

    const handleEraserAdded = (e: any) => {
      if (!e.targets) {
        return;
      }

      e.targets.forEach((target: fabric.Object) => {
        const targetJSON = target.toJSON(["_id"]);
        const clonedJSON = JSON.parse(JSON.stringify(targetJSON));

        clonedJSON.eraser.objects.pop();
        if (!clonedJSON.eraser.objects) {
          delete clonedJSON.eraser;
        }

        const updateObjectData: UpdateObjectData = {
          object: targetJSON,
        };
        socketEmitUpdateObject(updateObjectData);

        // const modifyCommand = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
        // saveCommand(modifyCommand);
      });
    };

    const handleTextEditingEntered = (e: any) => {
      dispatch({ type: "SET_OBSERVED_TEXT_ID", payload: e.target._id });
      dispatch({ type: "SET_OBSERVED_TEXT_CONTENT", payload: e.target.text });
    };

    const handleTextEditingExited = (e: any) => {
      if (e.target.text === state.observedTextContent) {
        return;
      }

      const targetJSON = e.target.toJSON(["_id"]);
      // const clonedJSON = { ...targetJSON, text: state.observedTextContent };

      const updateObjectData: UpdateObjectData = {
        object: targetJSON,
      };
      socketEmitUpdateObject(updateObjectData);

      // const command = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
      // saveCommand(command);

      dispatch({ type: "SET_OBSERVED_TEXT_CONTENT", payload: e.target.text });
    };

    const listeners = [
      { event: "path:created", handler: handlePathCreated },
      { event: "object:modified", handler: handleObjectModified },
      { event: "erasing:end", handler: handleEraserAdded },
      { event: "text:editing:entered", handler: handleTextEditingEntered },
      { event: "text:editing:exited", handler: handleTextEditingExited },
      { event: "selection:created", handler: handleMultipleSelections },
      { event: "selection:updated", handler: handleMultipleSelections },
    ];

    // Register event listeners
    listeners.forEach(({ event, handler }) => canvas.on(event, handler));

    // Cleanup event listeners on unmount
    return () => {
      listeners.forEach(({ event, handler }) => canvas.off(event, handler));
    };
  }, [
    canvas,
    saveCommand,
    handleStyleChange,
    state.observedTextContent,
    state.observedTextId,
    state.recentlyActiveObjects,
    socket,
    socketEmitAddObject,
    socketEmitUpdateObject,
    slideId,
  ]);
};

export default useCanvasEventHandlers;
