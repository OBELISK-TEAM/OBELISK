import { useEffect, useReducer } from "react";
import { fabric } from "fabric";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";
import { ComplexCommand } from "@/classes/undo-redo-commands/ComplexCommand";
import { getJsonWithAbsoluteProperties } from "@/utils/board/undoRedoUtils";
import { generateId } from "@/utils/randomUtils";
import { assignId } from "@/utils/utils";
import { canvasEventListenersReducer, initialState } from "@/reducers/canvasEventListenersReducer";

const useCanvasEventHandlers = (
  canvas: fabric.Canvas | null,
  saveCommand: (command: any) => void,
  handleStyleChange: () => void
) => {
  const [state, dispatch] = useReducer(canvasEventListenersReducer, initialState);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handlePathCreated = (e: any) => {
      if (!e.path || !canvas.contains(e.path)) {
        return;
      }

      const id = generateId("path");
      assignId(e.path, id);

      const command = new AddCommand(canvas, e.path.toJSON(["_id"]));
      saveCommand(command);
    };

    const handleActiveSelectionModification = () => {
      const activeObjects: fabric.Object[] = canvas.getActiveObjects();
      if (activeObjects.length <= 1) {
        return;
      }

      const activeObjectsJSONs = activeObjects.map((obj) => getJsonWithAbsoluteProperties(obj));
      const commands = activeObjectsJSONs.map((activeObjectJSON, i) => {
        const recentlyActiveObjectJSON = state.recentlyActiveObjects[i];
        return new ModifyCommand(canvas, recentlyActiveObjectJSON, activeObjectJSON, handleStyleChange);
      });

      saveCommand(new ComplexCommand(commands));
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
      const clonedJSON = { ...targetJSON, ...oldValues };

      const command = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
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
        const targetJSON = target.toJSON(["_id"]);
        const clonedJSON = JSON.parse(JSON.stringify(targetJSON));

        clonedJSON.eraser.objects.pop();
        if (!clonedJSON.eraser.objects) {
          delete clonedJSON.eraser;
        }

        const modifyCommand = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
        saveCommand(modifyCommand);
      });
    };

    const handleTextEditingEntered = (e: any) => {
      dispatch({ type: "SET_OBSERVED_TEXT_ID", payload: e.target._id });
      dispatch({ type: "SET_OBSERVED_TEXT_CONTENT", payload: e.target.text });
    };

    const handleTextEditingExited = (e: any) => {
      if (e.target._id !== state.observedTextId || e.target.text === state.observedTextContent) {
        return;
      }

      const targetJSON = e.target.toJSON(["_id"]);
      const clonedJSON = { ...targetJSON, text: state.observedTextContent };

      const command = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
      saveCommand(command);

      dispatch({ type: "SET_OBSERVED_TEXT_CONTENT", payload: e.target.text });
    };

    // Register event listeners
    canvas.on("path:created", handlePathCreated);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("erasing:end", handleEraserAdded);
    canvas.on("text:editing:entered", handleTextEditingEntered);
    canvas.on("text:editing:exited", handleTextEditingExited);
    canvas.on("selection:created", handleMultipleSelections);
    canvas.on("selection:updated", handleMultipleSelections);

    // Cleanup event listeners on unmount
    return () => {
      canvas.off("path:created", handlePathCreated);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("erasing:end", handleEraserAdded);
      canvas.off("text:editing:entered", handleTextEditingEntered);
      canvas.off("text:editing:exited", handleTextEditingExited);
      canvas.off("selection:created", handleMultipleSelections);
      canvas.off("selection:updated", handleMultipleSelections);
    };
  }, [
    canvas,
    saveCommand,
    handleStyleChange,
    state.observedTextContent,
    state.observedTextId,
    state.recentlyActiveObjects,
  ]);
};

export default useCanvasEventHandlers;
