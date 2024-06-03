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
  const [selectedObjectStyles, setSelectedObjectStyles] = useState<{
    [key: string]: any;
  } | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const newCanvas = initializeCanvas({ current: canvasRef.current });
    setCanvas(newCanvas);

    const handleSelectionUpdated = (e:any) => {
      setSelectedObjectStyles(getSelectedObjectStylesUtil(newCanvas));
      console.log(
        "Selection updated",
        JSON.stringify(getSelectedObjectStylesUtil(newCanvas))
      );
      const obj = e.target;
      updateDimensions(obj);
      setActiveItem(null);
    };

    const handleSelectionCreated = () => {
      setSelectedObjectStyles(getSelectedObjectStylesUtil(newCanvas));
      console.log(
        "Selection created",
        JSON.stringify(getSelectedObjectStylesUtil(newCanvas))
      );
      setActiveItem(null);
    };

    const handleSelectionCleared = () => {
      setSelectedObjectStyles(null);
      setActiveItem(null);
    };

    const handleObjectModified = (e: any) => {
      setSelectedObjectStyles(getSelectedObjectStylesUtil(newCanvas));
      console.log(
        "Object modified",
        JSON.stringify(getSelectedObjectStylesUtil(newCanvas))
      );
      const obj = e.target;
      updateDimensions(obj);
      setActiveItem(null);
    };

    newCanvas?.on("selection:updated", handleSelectionUpdated);
    newCanvas?.on("selection:created", handleSelectionCreated);
    newCanvas?.on("selection:cleared", handleSelectionCleared);
    newCanvas?.on("object:modified", handleObjectModified);

    return () => {
      newCanvas?.dispose();
    };
  }, []);

  const handleStyleChange = useCallback(
    (styles: object) => {
      if (canvas) {
        setSelectedObjectStylesUtil(canvas, styles);
        setSelectedObjectStyles(getSelectedObjectStylesUtil(canvas));
      }
    },
    [canvas]
  );

  return {
    canvasRef,
    canvas,
    selectedObjectStyles,
    handleStyleChange,
    activeItem,
    setActiveItem,
  };
};

export default useCanvas;
