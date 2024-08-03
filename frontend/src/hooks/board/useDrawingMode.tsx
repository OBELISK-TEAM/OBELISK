import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { toggleDrawingMode } from "@/lib/fabricCanvasUtils";

const useDrawingMode = (canvas: fabric.Canvas | null) => {
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  useEffect(() => {
    if (canvas) {
      toggleDrawingMode(canvas, isDrawingMode);
    }
  }, [isDrawingMode, canvas]);

  return { isDrawingMode, setIsDrawingMode };
};

export default useDrawingMode;
