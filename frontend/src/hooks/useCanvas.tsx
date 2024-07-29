import { useRef, useState, useEffect, useCallback } from "react";
import { fabric } from "fabric";
import {
  initializeCanvas,
  getSelectedObjectStyles as getSelectedObjectStylesUtil,
  setSelectedObjectStyles as setSelectedObjectStylesUtil,
  updateDimensions,
} from "@/lib/fabricCanvasUtils";

const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObjectStylesState, setSelectedObjectStylesState] = useState<{
    [key: string]: any;
  } | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    setCanvas(newCanvas);

    // the function is used nowhere, but I don't know, if I can remove it
    //
    // const handleSelectionUpdated = (e:any) => {
    //   setSelectedObjectStylesState(getSelectedObjectStylesUtil(newCanvas));
    //   const obj = e.target;
    //   updateDimensions(obj);
    //   setActiveItem(null);
    // };

    const handleSelectionCreated = () => {
      setSelectedObjectStylesState(getSelectedObjectStylesUtil(newCanvas));
      setActiveItem(null);
    };

    const handleSelectionCleared = () => {
      setSelectedObjectStylesState(null);
      setActiveItem(null);
    };

    const handleObjectModified = (e: any) => {
      setSelectedObjectStylesState(getSelectedObjectStylesUtil(newCanvas));
      const obj = e.target;
      updateDimensions(obj);
      setActiveItem(null);
    };

    const handleMouse = (e: any) => {
      setSelectedObjectStylesState(getSelectedObjectStylesUtil(newCanvas));
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
      if (canvas) {
        setSelectedObjectStylesUtil(canvas, styles);
        setSelectedObjectStylesState(getSelectedObjectStylesUtil(canvas));
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
