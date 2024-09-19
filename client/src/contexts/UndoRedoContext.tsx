"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect, useState } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";
import { UndoRedoContext as IUndoRedoContext } from "@/interfaces/undo-redo-context";
import { UndoRedoCommand } from "@/interfaces/canvas-action";
import { updateDimensions } from "@/utils/board/canvasUtils";

const UndoRedoContext = createContext<IUndoRedoContext | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas },
    handleStyleChange
  } = useCanvas();

  const [listenersOn, setListenersOn] = useState(true);

  const canvasRef = useRef<fabric.Canvas | null>(canvas);
  const undoStack = useRef<Array<UndoRedoCommand>>([]);
  const redoStack = useRef<Array<UndoRedoCommand>>([]);

  useEffect(() => {
    canvasRef.current = canvas;
    console.log("Canvas updated:", canvas);
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
    if (!canvas) { return; }

    console.log("Setting up canvas event listeners");
    const handlePathCreated = (e: any) => {
      if (!e.path) { return; }
      if (!listenersOn) { return; }

      // Object.assign(e.path, { id: generateId("path") });
      const command: UndoRedoCommand = {
        undo: () => {
          setListenersOn(false);
          canvas?.remove(e.path);
          setListenersOn(true);
        },
        redo: () => {
          setListenersOn(false)
          canvas?.add(e.path);
          setListenersOn(true);
        }
      }
      saveCommand(command);
    };

    /**
     * This handler handles those modifications, which are visible in the `fabric.IEvent#transform.original` object 
     * (like angle, scaleX, top, left etc.) (not like color, strokeWidth etc.)
     */
    const handleObjectModified = (e: fabric.IEvent) => {
      const targetOldValues = e.transform?.original; // the original properties values before modification
      const target = e.target; // the modified fabric object

      if (!targetOldValues || !target) { return; }
      if (!listenersOn) { return; }

      // here we store all the changes which happened with our object after the 'object:modified' event
      const changes: {key: keyof fabric.Object, oldValue: any; newValue: any}[] = [];

      // type of keys we expect in oldValues
      type Key = keyof typeof targetOldValues;
      (Object.keys(targetOldValues) as Key[]).forEach((key) => {
        const oldValue = targetOldValues[key];
        const newValue = target[key];

        if (oldValue !== newValue) {
          changes.push({ 
            key,
            oldValue,
            newValue
          });
        }
      });

      updateDimensions(target);
      handleStyleChange();

      if (changes.length === 0) { return; } // no changes, so no need to create a command for the undo redo stack

      const command: UndoRedoCommand = {
        undo: () => {
          changes.forEach(({key, newValue, oldValue}) => {
            if (key === 'scaleX' || key === 'scaleY') { // we need this exception, because of the 'updateDimensions' method
              target?.set(key, oldValue/newValue);
              target.setCoords();
            }
            else {
              target?.set(key, oldValue);
              target.setCoords();
            }
          });
          updateDimensions(target);
          handleStyleChange();
          canvas.renderAll();
        },
        redo: () => {
          changes.forEach(({key, newValue}) => {
            target?.set(key, newValue);
            target.setCoords();
          });
          updateDimensions(target);
          handleStyleChange();
          target.setCoords();
        }
      };

      saveCommand(command);
    }

    canvas.on("path:created", handlePathCreated);
    canvas.on("object:modified", handleObjectModified);

    return () => {
      console.log("Removing canvas event listeners");
      canvas.off("path:created", handlePathCreated);
      canvas.off("object:modified", handleObjectModified);
    };

  }, [canvas, saveCommand, listenersOn]);


  return (
    <UndoRedoContext.Provider value={{ saveCommand, undo, redo }}>{children}</UndoRedoContext.Provider>
  );
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedo must be used within an UndoRedoProvider");
  }
  return context;
};
