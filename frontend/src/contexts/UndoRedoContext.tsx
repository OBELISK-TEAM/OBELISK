"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";
import { UndoRedoContext as IUndoRedoContext } from "@/interfaces/undo-redo-context";

const UndoRedoContext = createContext<IUndoRedoContext | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas },
  } = useCanvas();

  const canvasRef = useRef<fabric.Canvas | null>(canvas);
  const undoStack = useRef<Array<any>>([]);
  const redoStack = useRef<Array<any>>([]);

  useEffect(() => {
    canvasRef.current = canvas;
  }, [canvas]);

  const areStatesEqual = (state1: any, state2: any) => {
    return JSON.stringify(state1) === JSON.stringify(state2);
  };

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const state = canvas.toJSON();
    if (undoStack.current.length === 0 || !areStatesEqual(state, undoStack.current[undoStack.current.length - 1])) {
      undoStack.current.push(state);
      if (undoStack.current.length > 50) {
        undoStack.current.shift();
      }
      redoStack.current.length = 0;
    }
  }, []);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && undoStack.current.length > 0) {
      const currentState = canvas.toJSON();
      redoStack.current.push(currentState);

      const state = undoStack.current.pop();
      if (!state) {
        return;
      }
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        canvas.calcOffset();
      });
    }
  }, []);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && redoStack.current.length > 0) {
      const currentState = canvas.toJSON();
      undoStack.current.push(currentState);

      const state = redoStack.current.pop();
      if (!state) {
        return;
      }
      canvas.loadFromJSON(state, () => {
        canvas.renderAll();
        canvas.calcOffset();
      });
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      const handleMouseDown = () => {
        saveState();
      };

      const handleMouseUp = () => {
        saveState();
      };

      const handlePathCreated = () => {
        saveState();
      };

      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("path:created", handlePathCreated);

      return () => {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:up", handleMouseUp);
        canvas.off("path:created", handlePathCreated);
      };
    }
  }, [canvas, saveState]);
  return <UndoRedoContext.Provider value={{ saveState, undo, redo }}>{children}</UndoRedoContext.Provider>;
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedo must be used within an UndoRedoProvider");
  }
  return context;
};
