"use client";
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, MutableRefObject } from "react";
import { ActionTypes, canvasReducer, initialState, State } from "@/reducers/canvasReducer";
import { initializeCanvas, toggleDrawingMode } from "@/utils/fabricCanvasUtils";
import { CanvasMode } from "@/enums/CanvasMode";
import { fabric } from "fabric";

export const getSelectedObjectStyles = (canvas: fabric.Canvas | null): object | null => {
  if (canvas) {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      return activeObject.toObject();
    }
  }
  return null;
};

export const setSelectedObjectStyles = (canvas: fabric.Canvas | null, styles: object): void => {
  if (!canvas) {
    return;
  }
  const activeObjects = canvas.getActiveObjects();
  activeObjects.forEach((obj) => {
    obj.set(styles);
  });
  canvas.requestRenderAll();
};
interface CanvasContextType {
  state: State;
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  setCanvasMode: (mode: CanvasMode) => void;
  setColor: (color: string) => void;
  setSize: (size: number) => void;
  handleStyleChange: (styles: object) => void;
  setActiveItem: (activeItem: string | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    dispatch({ type: ActionTypes.SET_CANVAS, canvas: newCanvas });

    const handleSelectionCreated = () => {
      dispatch({ type: ActionTypes.SET_SELECTED_OBJECT_STYLES, styles: getSelectedObjectStyles(newCanvas) });
      dispatch({ type: ActionTypes.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleSelectionCleared = () => {
      dispatch({ type: ActionTypes.SET_SELECTED_OBJECT_STYLES, styles: null });
      dispatch({ type: ActionTypes.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleObjectModified = () => {
      dispatch({ type: ActionTypes.SET_SELECTED_OBJECT_STYLES, styles: getSelectedObjectStyles(newCanvas) });
      dispatch({ type: ActionTypes.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleMouse = () => {
      dispatch({ type: ActionTypes.SET_SELECTED_OBJECT_STYLES, styles: getSelectedObjectStyles(newCanvas) });
      dispatch({ type: ActionTypes.SET_ACTIVE_ITEM, activeItem: null });
    };

    newCanvas?.on("selection:created", handleSelectionCreated);
    newCanvas?.on("selection:cleared", handleSelectionCleared);
    newCanvas?.on("object:modified", handleObjectModified);
    newCanvas?.on("mouse:down", handleMouse);
    newCanvas?.on("mouse:up", handleMouse);

    return () => {
      newCanvas?.dispose();
    };
  }, []);

  useEffect(() => {
    if (state.canvas) {
      toggleDrawingMode(state.canvas, state.canvasMode !== CanvasMode.Selection);
      state.canvas.freeDrawingBrush.color = state.color;
      state.canvas.freeDrawingBrush.width = state.size;
    }
  }, [state.canvasMode, state.color, state.size, state.canvas]);

  const setCanvasMode = (mode: CanvasMode) => {
    dispatch({ type: ActionTypes.SET_CANVAS_MODE, canvasMode: mode });
  };

  const setColor = (color: string) => {
    dispatch({ type: ActionTypes.SET_COLOR, color });
  };

  const setSize = (size: number) => {
    dispatch({ type: ActionTypes.SET_SIZE, size });
  };

  const setActiveItem = (activeItem: string | null) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_ITEM, activeItem });
  };

  const handleStyleChange = useCallback(
    (styles: object) => {
      if (state.canvas) {
        setSelectedObjectStyles(state.canvas, styles);
        dispatch({ type: ActionTypes.SET_SELECTED_OBJECT_STYLES, styles: getSelectedObjectStyles(state.canvas) });
      }
    },
    [state.canvas]
  );

  return (
    <CanvasContext.Provider
      value={{ state, canvasRef, setCanvasMode, setColor, setSize, handleStyleChange, setActiveItem }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
