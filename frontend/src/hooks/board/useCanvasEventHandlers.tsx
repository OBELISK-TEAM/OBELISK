import { useEffect } from "react";
import { fabric } from "fabric";

const useCanvasEventHandlers = (canvas: fabric.Canvas | null, saveState: () => void) => {
  useEffect(() => {
    if (canvas) {
      const handleMouseDown = () => {
        saveState();
      };

      const handleMouseUp = () => {
        saveState();
      };

      const handlePathCreated = () => {
        saveState();
      };

      //todo implement zoom in/out on canvas
      const handleMouseWheel = (opt: any) => {
        const evt = opt.e;
        if (canvas) {
          const delta = evt.deltaY;
          let zoom = canvas.getZoom();
          zoom *= 0.999 ** delta;
          if (zoom > 20) {
            zoom = 20;
          }
          if (zoom < 0.01) {
            zoom = 0.01;
          }
          canvas.zoomToPoint({ x: evt.offsetX, y: evt.offsetY }, zoom);
          evt.preventDefault();
          evt.stopPropagation();
        }
      };

      canvas.on("mouse:down", handleMouseDown);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("path:created", handlePathCreated);
      canvas.on("mouse:wheel", handleMouseWheel);

      return () => {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:up", handleMouseUp);
        canvas.off("path:created", handlePathCreated);
        canvas.off("mouse:wheel", handleMouseWheel);
      };
    }
  }, [canvas, saveState]);
};

export default useCanvasEventHandlers;
