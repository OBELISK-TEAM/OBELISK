"use client";
import React, { createContext, useContext, useReducer, useEffect, useRef, useMemo, useCallback } from "react";
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
import { ZoomConfig } from "@/config/zoomConfig";
import { useZoom } from "./ZoomUIContext";
import useSocketListeners from "@/hooks/socket/useSocketListeners";
import { useSocket } from "./SocketContext";
import { throttle } from "lodash";
import { getColorFromEmail } from "@/lib/colorUtils";
import { useAuth } from "@/contexts/AuthContext";
import { fabric } from "fabric";
import { DELAYS } from "@/config/delayConfig";

const CanvasContext = createContext<ICanvasContext | undefined>(undefined);

interface CanvasProviderProps {
  children: React.ReactNode;
  slideId: string | undefined;
  slideData: any;
  slideIndex: number;
  boardId: string;
}

export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  children,
  slideId,
  slideData,
  slideIndex,
  boardId,
}) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { handleZoom } = useZoom();
  const {
    socket,
    userCapabilities: { canManageObject },
  } = useSocket();
  const { decodedToken } = useAuth();
  const email = decodedToken?.email ?? "";
  const userColor = useMemo(() => getColorFromEmail(email), [email]);
  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current }, canManageObject);
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
      zoom *= ZoomConfig.ZOOM_SMOOTHICITY ** delta;
      if (zoom > ZoomConfig.MAX_ZOOM) {
        zoom = ZoomConfig.MAX_ZOOM;
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
    const throttledHandleMouseMove = throttle((event: fabric.IEvent) => {
      const canvas = state.canvas;
      if (!canvas || !event.e) {
        return;
      }
      const pointer = canvas.getPointer(event.e as any, false);
      if (pointer) {
        const x = pointer.x;
        const y = pointer.y;

        socket?.volatile.emit("cursor-move", { x, y, color: userColor } as any);
      }
    }, DELAYS.CURSOR_MOVE);

    if (slideData && canvasRef.current && state.canvas) {
      state.canvas.loadFromJSON(slideData, () => state.canvas?.renderAll());
    }

    state.canvas?.on("mouse:move", throttledHandleMouseMove);

    return () => {
      state.canvas?.off("mouse:move", throttledHandleMouseMove);
      throttledHandleMouseMove.cancel();
    };
  }, [state.canvas, slideData]);

  useEffect(() => {
    if (state.canvas) {
      toggleDrawingMode(state.canvas, state.canvasMode !== CanvasMode.SELECTION);
      state.canvas.freeDrawingBrush.color = state.color;
      state.canvas.freeDrawingBrush.width = state.size;
    }
  }, [state.canvasMode, state.color, state.size, state.canvas]);

  const setCanvasMode = useCallback((mode: CanvasMode) => {
    dispatch({ type: CanvasReducerAction.SET_CANVAS_MODE, canvasMode: mode });
  }, []);

  const setColor = useCallback((color: string) => {
    dispatch({ type: CanvasReducerAction.SET_COLOR, color });
  }, []);

  const setSize = useCallback((size: number) => {
    dispatch({ type: CanvasReducerAction.SET_SIZE, size });
  }, []);

  const setActiveItem = useCallback((activeItem: string | null) => {
    dispatch({ type: CanvasReducerAction.SET_ACTIVE_ITEM, activeItem });
  }, []);

  const handleStyleChange = useCallback(() => {
    dispatch({
      type: CanvasReducerAction.SET_SELECTED_OBJECT_STYLES,
      styles: getSelectedObjectStyles(state.canvas),
    });
  }, [state.canvas]);

  useSocketListeners(socket, state.canvas);

  return (
    <CanvasContext.Provider
      value={{
        state,
        canvasRef,
        setCanvasMode,
        setColor,
        setSize,
        handleStyleChange,
        setActiveItem,
        slideIndex,
        boardId,
        slideId,
      }}
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
