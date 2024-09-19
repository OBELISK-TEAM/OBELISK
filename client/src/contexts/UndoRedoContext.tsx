"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";
import { UndoRedoContext as IUndoRedoContext, UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { updateDimensions } from "@/utils/board/canvasUtils";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { generateId } from "@/utils/randomUtils";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";
import { ComplexCommand } from "@/classes/undo-redo-commands/ComplexCommand";
import { getJsonWithAbsoluteProperties } from "@/utils/board/undoRedoUtils";
import { assignId } from "@/utils/utils";

const UndoRedoContext = createContext<IUndoRedoContext | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas },
    handleStyleChange,
  } = useCanvas();

  // these states are used to memorize the content of recently modified text
  // so that we can use this old value to prepare a propper ModifiedCommand
  const [observedTextId, setObservedTextId] = useState<string | undefined>(undefined);
  const [observedTextContent, setObservedTextContent] = useState<string | undefined>(undefined);

  const [recentlyActiveObjects, setRecentlyActiveObjects] = useState<any[]>([]);

  const canvasRef = useRef<fabric.Canvas | null>(canvas);
  const undoStack = useRef<Array<UndoRedoCommand>>([]);
  const redoStack = useRef<Array<UndoRedoCommand>>([]);

  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas]);

  const saveCommand = useCallback((command: UndoRedoCommand) => {
    undoStack.current.push(command);
    if (undoStack.current.length > 50) {
      undoStack.current.shift();
    }
    redoStack.current.length = 0;
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || undoStack.current.length === 0) {
      return;
    }
    const lastAction = undoStack.current.pop();
    if (!lastAction) {
      return;
    }

    lastAction.undo();
    redoStack.current.push(lastAction);
    canvas.renderAll();
  }, []);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || redoStack.current.length === 0) {
      return;
    }
    const lastAction = redoStack.current.pop();
    if (!lastAction) {
      return;
    }

    lastAction.redo();
    undoStack.current.push(lastAction);
    canvas.renderAll();
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const handlePathCreated = (e: any) => {
      if (!e.path) {
        return;
      }

      if (!canvas.contains(e.path)) {
        return;
      } // to differentiate betwen 'real paths' and 'eraser paths'

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

      const activeObjectsJSONs = activeObjects.map((obj: fabric.Object) => getJsonWithAbsoluteProperties(obj));

      const commands: UndoRedoCommand[] = [];
      for (const i in activeObjectsJSONs) {
        const activeObjectJSON = activeObjectsJSONs[i];
        const recentlyActiveObjectJSON = recentlyActiveObjects[i];

        commands.push(new ModifyCommand(canvas, recentlyActiveObjectJSON, activeObjectJSON, handleStyleChange));
      }
      saveCommand(new ComplexCommand(commands));
    };

    /**
     * This handler handles oly those modifications, which are visible in the `fabric.IEvent#transform.original` object
     * (like angle, scaleX, top, left etc.) (not like color, strokeWidth etc.)
     */
    const handleObjectModified = (e: fabric.IEvent) => {
      if (e.target?.type === "activeSelection") {
        handleActiveSelectionModification();
        return;
      }

      const oldValues = e.transform?.original; // the original properties values before modification
      const target = e.target;

      if (!oldValues || !target) {
        return;
      }

      const targetJSON = target.toJSON(["_id"]);
      const clonedJSON = JSON.parse(JSON.stringify(targetJSON));
      Object.assign(clonedJSON, oldValues);
      const command = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
      saveCommand(command);

      updateDimensions(target);
      handleStyleChange();
    };

    const handleMultipleSelections = () => {
      const activeObjects: fabric.Object[] = canvas.getActiveObjects();

      if (activeObjects.length <= 1) {
        return;
      }

      const activeObjectsJSONs = activeObjects.map((obj: fabric.Object) => getJsonWithAbsoluteProperties(obj));

      setRecentlyActiveObjects(activeObjectsJSONs);
    };

    const handleEraserAdded = (e: any) => {
      if (!e.targets) {
        return;
      } // the erased path doesn't collide with enything erasable

      for (const target of e.targets) {
        const targetJSON = target.toJSON(["_id"]);
        const clonedJSON = JSON.parse(JSON.stringify(targetJSON));

        clonedJSON.eraser.objects.pop();
        if (!clonedJSON.eraser.objects) {
          delete clonedJSON.eraser;
        }

        const modifyCommand = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
        saveCommand(modifyCommand);
      }
    };

    const handleTextEditingEntered = (e: any) => {
      setObservedTextId(e.target._id);
      setObservedTextContent(e.target.text);
    };

    const handleTextEditingExited = (e: any) => {
      const currentId: string = e.target._id;
      if (currentId !== observedTextId) {
        // that's not the same object
        return;
      }

      const currentText: string = e.target.text;
      if (currentText === observedTextContent) {
        // text content hasn't changed
        return;
      }

      const targetJSON = e.target.toJSON(["_id"]);
      const clonedJSON = JSON.parse(JSON.stringify(targetJSON));
      clonedJSON.text = observedTextContent;

      const command = new ModifyCommand(canvas, clonedJSON, targetJSON, handleStyleChange);
      saveCommand(command);

      setObservedTextContent(currentText);
    };

    canvas.on("path:created", handlePathCreated);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("erasing:end", handleEraserAdded);
    canvas.on("text:editing:entered", handleTextEditingEntered);
    canvas.on("text:editing:exited", handleTextEditingExited);
    canvas.on("selection:created", handleMultipleSelections);
    canvas.on("selection:updated", handleMultipleSelections);

    return () => {
      canvas.off("path:created", handlePathCreated);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("erasing:end", handleEraserAdded);
      canvas.off("text:editing:entered", handleTextEditingEntered);
      canvas.off("text:editing:exited", handleTextEditingExited);
      canvas.off("selection:created", handleMultipleSelections);
      canvas.off("selection:updated", handleMultipleSelections);
    };
  }, [canvas, saveCommand, handleStyleChange, observedTextContent, observedTextId, recentlyActiveObjects]);

  return <UndoRedoContext.Provider value={{ saveCommand, undo, redo }}>{children}</UndoRedoContext.Provider>;
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedo must be used within an UndoRedoProvider");
  }
  return context;
};
