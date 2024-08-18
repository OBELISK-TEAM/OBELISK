import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { toggleDrawingMode } from "@/lib/fabricCanvasUtils";
import { CanvasMode } from "@/enums/CanvasMode";

const useCanvasMode = (canvas: fabric.Canvas | null) => {
  const [canvasMode, setCanvasMode] = useState<CanvasMode>(CanvasMode.SELECT);

  useEffect(() => {
    if (canvas) {
      toggleDrawingMode(canvas, canvasMode !== CanvasMode.SELECT);
    }
  }, [canvasMode, canvas]);

  return { canvasMode, setCanvasMode };
};

export default useCanvasMode;
