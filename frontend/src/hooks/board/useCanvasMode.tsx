import { useState, useEffect } from "react";
import { fabric } from "fabric";
import { toggleDrawingMode } from "@/utils/fabricCanvasUtils";
import { CanvasMode } from "@/enums/CanvasMode";

const useCanvasMode = (canvas: fabric.Canvas | null) => {
  const [canvasMode, setCanvasMode] = useState<CanvasMode | null>(CanvasMode.Selection);

  useEffect(() => {
    if (canvas) {
      toggleDrawingMode(canvas, canvasMode !== CanvasMode.Selection);
    }
  }, [canvasMode, canvas]);

  return { canvasMode, setCanvasMode };
};

export default useCanvasMode;
