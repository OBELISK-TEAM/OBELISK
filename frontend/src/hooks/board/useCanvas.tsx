import { useRef, useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import { initializeCanvas, updateDimensions } from "@/utils/fabricCanvasUtils";

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

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObjectStylesState, setSelectedObjectStylesState] = useState<{
    [key: string]: any;
  } | null>(null);
  console.log("selectedObjectStylesState", selectedObjectStylesState);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    setCanvas(newCanvas);
    const handleSelectionCreated = () => {
      setSelectedObjectStylesState(getSelectedObjectStyles(newCanvas));
      setActiveItem(null);
    };

    const handleSelectionCleared = () => {
      setSelectedObjectStylesState(null);
      setActiveItem(null);
    };

    const handleObjectModified = (e: any) => {
      setSelectedObjectStylesState(getSelectedObjectStyles(newCanvas));
      const obj = e.target;
      updateDimensions(obj);
      setActiveItem(null);
    };

    const handleMouse = (e: any) => {
      setSelectedObjectStylesState(getSelectedObjectStyles(newCanvas));
      const obj = e.target;
      updateDimensions(obj);
      setActiveItem(null);
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

  const handleStyleChange = useCallback(
    (styles: object) => {
      console.log("styles", styles);
      if (canvas) {
        setSelectedObjectStyles(canvas, styles);
        setSelectedObjectStylesState(getSelectedObjectStyles(canvas));
      }
    },
    [canvas]
  );

  return {
    canvasRef,
    canvas,
    selectedObjectStyles: selectedObjectStylesState,
    handleStyleChange,
    activeItem,
    setActiveItem,
  };
};

export default useCanvas;
