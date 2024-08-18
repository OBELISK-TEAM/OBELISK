import { useRef, useCallback, useEffect } from "react";
import { fabric } from "fabric";

const useUndoRedo = (initialCanvas: fabric.Canvas | null) => {
  const canvasRef = useRef<fabric.Canvas | null>(initialCanvas);
  const undoStack = useRef<Array<any>>([]);
  const redoStack = useRef<Array<any>>([]);

  useEffect(() => {
    canvasRef.current = initialCanvas;
  }, [initialCanvas]);

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

  return { saveState, undo, redo };
};

export default useUndoRedo;
