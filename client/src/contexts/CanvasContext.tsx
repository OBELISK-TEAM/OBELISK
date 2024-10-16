"use client";
import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { canvasReducer, initialState } from "@/reducers/canvasReducer";
import { CanvasMode } from "@/enums/CanvasMode";
import { CanvasReducerAction } from "@/enums/CanvasReducerAction";
import { CanvasContext as ICanvasContext } from "@/interfaces/canvas-context";
import {
  getSelectedObjectStyles,
  initializeCanvas,
  toggleDrawingMode,
  updateDimensions,
} from "@/lib/board/canvasUtils";
import { ZoomOptions } from "@/enums/ZoomOptions";
import { useZoom } from "./ZoomUIContext";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";

const CanvasContext = createContext<ICanvasContext | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: React.ReactNode; boardData: BoardDataResponse }> = ({
  children,
  boardData,
}) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { handleZoom } = useZoom();
  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    dispatch({ type: CanvasReducerAction.SET_CANVAS, canvas: newCanvas });

    const handleSelectionCreated = () => {
      //toolbar appear
      dispatch({
        type: CanvasReducerAction.SET_SELECTED_OBJECT_STYLES,
        styles: getSelectedObjectStyles(newCanvas),
      });
      // activeItem can be cleared here
      dispatch({ type: CanvasReducerAction.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleSelectionCleared = () => {
      //toolbar disappear
      dispatch({ type: CanvasReducerAction.SET_SELECTED_OBJECT_STYLES, styles: null });
      dispatch({ type: CanvasReducerAction.SET_ACTIVE_ITEM, activeItem: null });
    };

    const handleMouseUpDown = (e: fabric.IEvent) => {
      if (!e.target) {
        return;
      }
      //toolbar is updating
      dispatch({
        type: CanvasReducerAction.SET_SELECTED_OBJECT_STYLES,
        styles: getSelectedObjectStyles(newCanvas),
      });
      dispatch({ type: CanvasReducerAction.SET_ACTIVE_ITEM, activeItem: null });
      const obj = e.target;
      // ensure the object is scaled properly
      updateDimensions(obj);
    };

    const handleMouseWheel = (opt: any) => {
      const evt = opt.e;
      if (!newCanvas) {
        return;
      }
      const delta = evt.deltaY;
      let zoom = newCanvas.getZoom();
      zoom *= ZoomOptions.ZOOM_SMOOTHICITY ** delta;
      if (zoom > ZoomOptions.MAX_ZOOM) {
        zoom = ZoomOptions.MAX_ZOOM;
      }
      if (zoom < 1) {
        zoom = 1;
      }
      newCanvas.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
      handleZoom(zoom);

      const vpt = newCanvas.viewportTransform;
      if (vpt) {
        vpt[4] = Math.min(0, Math.max(vpt[4], newCanvas.getWidth() - newCanvas.getWidth() * zoom));
        vpt[5] = Math.min(0, Math.max(vpt[5], newCanvas.getHeight() - newCanvas.getHeight() * zoom));
        newCanvas.setViewportTransform(vpt);
      }

      evt.preventDefault();
      evt.stopPropagation();
    };

    newCanvas?.on("mouse:wheel", handleMouseWheel);

    newCanvas?.on("selection:created", handleSelectionCreated);
    newCanvas?.on("selection:cleared", handleSelectionCleared);
    // newCanvas?.on("object:modified", handleObjectModified);

    newCanvas?.on("mouse:down", handleMouseUpDown);
    newCanvas?.on("mouse:up", handleMouseUpDown);

    return () => {
      newCanvas?.dispose();
    };
  }, [handleZoom]);

  useEffect(() => {
    if (boardData.slide && canvasRef.current && state.canvas) {
      state.canvas.loadFromJSON(boardData.slide, () => state.canvas?.renderAll());
    }
  }, [state.canvas, boardData.slide]);
  useEffect(() => {
    if (state.canvas) {
      toggleDrawingMode(state.canvas, state.canvasMode !== CanvasMode.SELECTION);
      state.canvas.freeDrawingBrush.color = state.color;
      state.canvas.freeDrawingBrush.width = state.size;
    }
  }, [state.canvasMode, state.color, state.size, state.canvas]);

  const setCanvasMode = (mode: CanvasMode) => {
    dispatch({ type: CanvasReducerAction.SET_CANVAS_MODE, canvasMode: mode });
  };

  const setColor = (color: string) => {
    dispatch({ type: CanvasReducerAction.SET_COLOR, color });
  };

  const setSize = (size: number) => {
    dispatch({ type: CanvasReducerAction.SET_SIZE, size });
  };

  const setActiveItem = (activeItem: string | null) => {
    dispatch({ type: CanvasReducerAction.SET_ACTIVE_ITEM, activeItem });
  };

  const handleStyleChange = () => {
    dispatch({
      type: CanvasReducerAction.SET_SELECTED_OBJECT_STYLES,
      styles: getSelectedObjectStyles(state.canvas),
    });
  };

  return (
    <CanvasContext.Provider
      value={{ state, canvasRef, setCanvasMode, setColor, setSize, handleStyleChange, setActiveItem, boardData }}
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
