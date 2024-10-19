import { useEffect, useReducer } from "react";
import { fabric } from "fabric";
import { getJsonWithAbsoluteProperties } from "@/lib/board/undoRedoUtils";

import { canvasEventListenersReducer, initialState } from "@/reducers/canvasEventListenersReducer";
import { assignId } from "@/lib/utils";
import { useSocket } from "@/contexts/SocketContext";
import { AddObjectData, UpdateObjectData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitAddObject, socketEmitUpdateObject } from "@/lib/board/socketEmitUtils";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";
import { ComplexCommand } from "@/classes/undo-redo-commands/ComplexCommand";

const useCanvasEventHandlers = (
  canvas: fabric.Canvas | null,
  saveCommand: (command: any) => void,
  handleStyleChange: () => void
) => {
  const [state, dispatch] = useReducer(canvasEventListenersReducer, initialState);
  const { socket } = useSocket();

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handlePathCreated = (e: any) => {
      if (!e.path || !canvas.contains(e.path)) {
        return;
      }
      if (!socket) {
        return;
      }

      const objectData = e.path.toJSON();
      const addObjectData: AddObjectData = {
        object: objectData,
      };
      const callback = (addedObjectData: any) => {
        assignId(e.path, addedObjectData._id);
        const command = new AddCommand(canvas, e.path.toJSON(["_id"]));
        saveCommand(command);
      };
      socketEmitAddObject(socket, addObjectData, callback);
    };

    const handleActiveSelectionModification = () => {
      const activeObjects: fabric.Object[] = canvas.getActiveObjects();
      if (activeObjects.length <= 1) {
        return;
      }
      if (!socket) {
        return;
      }

      const activeObjectsJSONs = activeObjects.map((obj) => getJsonWithAbsoluteProperties(obj));

      for (const activeObjectJSON of activeObjectsJSONs) {
        const updateObjectData: UpdateObjectData = {
          object: activeObjectJSON,
        };
        socketEmitUpdateObject(socket, updateObjectData);
      }

      const commands = activeObjectsJSONs.map((activeObjectJSON, i) => {
        const recentlyActiveObjectJSON = state.recentlyActiveObjects[i];
        const objectId: string = recentlyActiveObjectJSON._id;
        return new ModifyCommand(canvas, recentlyActiveObjectJSON, activeObjectJSON, objectId, handleStyleChange);
      });

      saveCommand(new ComplexCommand(commands));
    };

    const handleObjectModified = (e: fabric.IEvent) => {
      if (e.target?.type === "activeSelection") {
        handleActiveSelectionModification();
        return;
      }

      // console.log(e.target);

      const oldValues = e.transform?.original;
      const target = e.target;

      if (!oldValues || !target) {
        return;
      }
      if (!socket) {
        return;
      }

      const targetJSON = target.toJSON(["_id"]) as any;
      const clonedJSON = { ...targetJSON, ...oldValues };

      const updateObjectData: UpdateObjectData = {
        object: targetJSON,
      };
      socketEmitUpdateObject(socket, updateObjectData);
      const command = new ModifyCommand(canvas, clonedJSON, targetJSON, targetJSON._id, handleStyleChange);
      saveCommand(command);

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
        const targetJSON = target.toJSON(["_id"]) as any;
        const clonedJSON = JSON.parse(JSON.stringify(targetJSON));

        clonedJSON.eraser.objects.pop();
        if (!clonedJSON.eraser.objects) {
          delete clonedJSON.eraser;
        }

        if (!socket) {
          return;
        }

        const updateObjectData: UpdateObjectData = {
          object: targetJSON,
        };
        socketEmitUpdateObject(socket, updateObjectData);

        const modifyCommand = new ModifyCommand(canvas, clonedJSON, targetJSON, targetJSON._id, handleStyleChange);
        saveCommand(modifyCommand);
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
      if (!socket) {
        return;
      }

      const targetJSON = e.target.toJSON(["_id"]);
      const clonedJSON = { ...targetJSON, text: state.observedTextContent };

      const updateObjectData: UpdateObjectData = {
        object: targetJSON,
      };
      socketEmitUpdateObject(socket, updateObjectData);

      const command = new ModifyCommand(canvas, clonedJSON, targetJSON, targetJSON._id, handleStyleChange);
      saveCommand(command);

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

    listeners.forEach(({ event, handler }) => canvas.on(event, handler));

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
  ]);
};

export default useCanvasEventHandlers;
