"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";
import { UndoRedoContext as IUndoRedoContext } from "@/interfaces/undo-redo-context";
import { UndoRedoCommand } from "@/interfaces/canvas-action";

const UndoRedoContext = createContext<IUndoRedoContext | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas },
  } = useCanvas();

  const canvasRef = useRef<fabric.Canvas | null>(canvas);
  const undoStack = useRef<Array<UndoRedoCommand>>([]);
  const redoStack = useRef<Array<UndoRedoCommand>>([]);

  useEffect(() => {
    canvasRef.current = canvas;
    console.log("Canvas updated:", canvas);
  }, [canvas]);

  const saveAction = useCallback((command: UndoRedoCommand) => {
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

    console.log("undo -", lastAction);

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

    console.log("redo -", lastAction);
    lastAction.redo();
    undoStack.current.push(lastAction);
    canvas.renderAll();
  }, []);

  return (
    <UndoRedoContext.Provider value={{ saveCommand: saveAction, undo, redo }}>{children}</UndoRedoContext.Provider>
  );
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedo must be used within an UndoRedoProvider");
  }
  return context;
};
