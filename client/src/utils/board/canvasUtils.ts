import { fabric } from "fabric";
import { CanvasRef } from "@/interfaces/canvas-context";
import { CanvasObjectTypes } from "@/enums/CanvasObjectTypes";

export const getItemById = (canvas: fabric.Canvas, id: string): fabric.Object | null => {
  return canvas.getObjects().find((object: any) => object.id === id) || null;
};

export const getSelectedObjectStyles = (canvas: fabric.Canvas | null): object | null => {
  if (!canvas) { return null; }

  const activeObject = canvas.getActiveObject();
  if (!activeObject) { return null; }

  return activeObject.toObject();
};

export const setObjectStyle = (canvas: fabric.Canvas | null, fabricObject: fabric.Object | null, styles: object): fabric.Object | undefined => {
  if (!canvas || !fabricObject) {
    return;
  }
  fabricObject.set(styles);
  canvas.requestRenderAll();
};

export const initializeCanvas = (canvasRef: CanvasRef): fabric.Canvas | null => {
  if (canvasRef.current) {
    return new fabric.Canvas(canvasRef.current, {
      selection: true,
    });
    // i am not sure if this is needed, i will leave this here if there will be a problem
    //newCanvas.on("before:render", () => (newCanvas.selection = false));
    //newCanvas.on("after:render", () => (newCanvas.selection = true));
  }
  return null;
};

export const toggleDrawingMode = (canvas: fabric.Canvas | null, isDrawingMode: boolean): void => {
  if (canvas) {
    canvas.isDrawingMode = isDrawingMode;
  }
};

/**
 * This function scales the passed `fabricjs` object.
 * It reads the values of `scaleX` and `scaleY` properties and applies them to the `width` and `height` properties
 * by simply multiplying them accordingly. As of result the `scaleX` and `scaleY` properties are set to 1.
 *
 * This function supports partialy erased objects (takes into account the `eraser` property).
 * @param obj
 */
export const updateDimensions = (obj: any): void => {
  if (!obj) {
    return;
  }
  if (
    obj.type === CanvasObjectTypes.RECT ||
    obj.type === CanvasObjectTypes.CIRCLE ||
    obj.type === CanvasObjectTypes.LINE
  ) {
    const initialObjScaleX = obj.scaleX;
    const initialObjScaleY = obj.scaleY;
    const scaledWidth = Math.round(obj.width * initialObjScaleX);
    const scaledHeight = Math.round(obj.height * initialObjScaleY);
    const scaledRadius = obj.radius ? Math.round(obj.radius * Math.max(obj.scaleX, obj.scaleY)) : undefined;
    // scale the object itself
    obj.set({
      width: scaledWidth,
      height: scaledHeight,
      radius: scaledRadius,
      scaleX: 1,
      scaleY: 1,
    });

    // scale the erased parts
    if (obj.eraser) {
      obj.eraser.scaleX *= initialObjScaleX;
      obj.eraser.scaleY *= initialObjScaleY;
    }
  }
  obj.setCoords();
};

//todo: make use of this zoom function
export const handleZoom = (opt: fabric.IEvent<WheelEvent>): void => {
  const evt = opt.e;
  const target = opt.target as unknown as fabric.Canvas | undefined;
  if (target && target instanceof fabric.Canvas) {
    const delta = evt.deltaY;
    const pointer = target.getPointer(evt);
    const zoom = target.getZoom();
    const newZoom = zoom * (1 - delta / 200);
    target.zoomToPoint(new fabric.Point(pointer.x, pointer.y), newZoom);
    evt.preventDefault();
    evt.stopPropagation();
  }
};
