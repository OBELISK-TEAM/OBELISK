"use client";
import React, { createContext, useContext, useRef, useCallback, useEffect } from "react";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";
import { UndoRedoContext as IUndoRedoContext, UndoRedoCommand } from "@/interfaces/undo-redo-context";
import useCanvasEventHandlers from "@/hooks/board/useCanvasEventListeners";
import { useSocket } from "./SocketContext";

const UndoRedoContext = createContext<IUndoRedoContext | undefined>(undefined);

export const UndoRedoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    state: { canvas },
    handleStyleChange,
  } = useCanvas();
  const { socket } = useSocket();

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
    if (!canvas || !socket || undoStack.current.length === 0) {
      return;
    }

    const lastAction = undoStack.current.pop();
    if (!lastAction) {
      return;
    }

    lastAction.undo(socket);
    redoStack.current.push(lastAction);
    canvas.renderAll();
  }, [socket]);

  const redo = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !socket || redoStack.current.length === 0) {
      return;
    }

    const lastAction = redoStack.current.pop();
    if (!lastAction) {
      return;
    }

    lastAction.redo(socket);
    undoStack.current.push(lastAction);
    canvas.renderAll();
  }, [socket]);

  useCanvasEventHandlers(canvas, saveCommand, handleStyleChange);

  return <UndoRedoContext.Provider value={{ saveCommand, undo, redo }}>{children}</UndoRedoContext.Provider>;
};

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useUndoRedo must be used within an UndoRedoProvider");
  }
  return context;
};
