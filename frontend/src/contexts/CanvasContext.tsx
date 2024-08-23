"use client";
import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import { canvasReducer, initialState } from "@/reducers/canvasReducer";
import { CanvasMode } from "@/enums/CanvasMode";
import { CanvasReducerActionEnum } from "@/enums/CanvasReducerAction";
import { ICanvasContext } from "@/interfaces/canvas-context";
import {
  getSelectedObjectStyles,
  initializeCanvas,
  setSelectedObjectStyles,
  toggleDrawingMode,
  updateDimensions,
} from "@/utils/board/canvasUtils";

const CanvasContext = createContext<ICanvasContext | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    dispatch({ type: CanvasReducerActionEnum.SET_CANVAS, canvas: newCanvas });

    const handleSelectionCreated = () => {
      //toolbar appear
      dispatch({
        type: CanvasReducerActionEnum.SET_SELECTED_OBJECT_STYLES,
        styles: getSelectedObjectStyles(newCanvas),
      });
      // activeItem can be cleared here
      dispatch({ type: CanvasReducerActionEnum.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleSelectionCleared = () => {
      //toolbar disappear
      dispatch({ type: CanvasReducerActionEnum.SET_SELECTED_OBJECT_STYLES, styles: null });
      dispatch({ type: CanvasReducerActionEnum.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleObjectModified = (e: fabric.IEvent) => {
      if (!e.target) {
        return;
      }
      //toolbar is updating
      dispatch({
        type: CanvasReducerActionEnum.SET_SELECTED_OBJECT_STYLES,
        styles: getSelectedObjectStyles(newCanvas),
      });
      dispatch({ type: CanvasReducerActionEnum.SET_ACTIVE_ITEM, activeItem: null });
      const obj = e.target;
      // ensure the object is scaled properly
      updateDimensions(obj);
    };

    newCanvas?.on("selection:created", handleSelectionCreated);
    newCanvas?.on("selection:cleared", handleSelectionCleared);
    newCanvas?.on("object:modified", handleObjectModified);

    newCanvas?.on("mouse:down", handleObjectModified);
    newCanvas?.on("mouse:up", handleObjectModified);

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
    dispatch({ type: CanvasReducerActionEnum.SET_CANVAS_MODE, canvasMode: mode });
  };

  const setColor = (color: string) => {
    dispatch({ type: CanvasReducerActionEnum.SET_COLOR, color });
  };

  const setSize = (size: number) => {
    dispatch({ type: CanvasReducerActionEnum.SET_SIZE, size });
  };

  const setActiveItem = (activeItem: string | null) => {
    dispatch({ type: CanvasReducerActionEnum.SET_ACTIVE_ITEM, activeItem });
  };

  const handleStyleChange = useCallback(
    (styles: object) => {
      if (state.canvas) {
        setSelectedObjectStyles(state.canvas, styles);
        dispatch({
          type: CanvasReducerActionEnum.SET_SELECTED_OBJECT_STYLES,
          styles: getSelectedObjectStyles(state.canvas),
        });
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
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
