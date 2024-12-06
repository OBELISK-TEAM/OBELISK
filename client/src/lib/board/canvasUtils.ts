import { fabric } from "fabric";
import { CanvasRef } from "@/interfaces/canvas-context";
import { CanvasObjectTypes } from "@/enums/CanvasObjectTypes";

export const getItemById = (canvas: fabric.Canvas, id: string): fabric.Object | null => {
  return canvas.getObjects().find((object: any) => object._id === id) || null;
};

export const getSelectedObjectStyles = (canvas: fabric.Canvas | null): object | null => {
  if (!canvas) {
    return null;
  }

  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    return null;
  }

  return activeObject.toObject();
};

export const setObjectStyle = (
  canvas: fabric.Canvas | null,
  fabricObject: fabric.Object | null,
  styles: object
): fabric.Object | undefined => {
  if (!canvas || !fabricObject) {
    return;
  }
  fabricObject.set(styles);
  canvas.requestRenderAll();
};

export const initializeCanvas = (canvasRef: CanvasRef, canControlObject: boolean): fabric.Canvas | null => {
  configureGlobalFabricDefaultProperties();
  configureGlobalFabricInteractivity(canControlObject);
  if (canvasRef.current) {
    return new fabric.Canvas(canvasRef.current, {
      selection: true,
      interactive: canControlObject,
    });
    // i am not sure if this is needed, i will leave this here if there will be a problem
    //newCanvas.on("before:render", () => (newCanvas.selection = false));
    //newCanvas.on("after:render", () => (newCanvas.selection = true));
  }
  return null;
};

export const configureGlobalFabricDefaultProperties = (): void => {
  fabric.Text.prototype.lockScalingX = true;
  fabric.Text.prototype.lockScalingY = true;
  fabric.Text.prototype.hasRotatingPoint = false;
  fabric.Text.prototype.hasBorders = true;
  fabric.Text.prototype.hasControls = true;

  fabric.IText.prototype.lockScalingX = true;
  fabric.IText.prototype.lockScalingY = true;
  fabric.IText.prototype.hasRotatingPoint = false;
  fabric.IText.prototype.hasBorders = true;
  fabric.IText.prototype.hasControls = true;

  // as long as we can't handle scaling and rotating regarding undo/redo commands, we need to lock these possibilities for users
  fabric.ActiveSelection.prototype.lockScalingX = true;
  fabric.ActiveSelection.prototype.lockScalingY = true;
  fabric.ActiveSelection.prototype.lockRotation = true;

  // default properties for all objects
  fabric.Object.prototype.stroke = "#000000";
  fabric.Object.prototype.strokeWidth = 0;
};

export const configureGlobalFabricInteractivity = (canControlObject: boolean): void => {
  // we need to lock some properties for non-interactive users (we can't just use css property `pointer-events: none` because it will block zoom effect)

  fabric.Object.prototype.lockMovementX = !canControlObject;
  fabric.Object.prototype.lockMovementY = !canControlObject;
  fabric.Textbox.prototype.editable = canControlObject;
  fabric.IText.prototype.editable = canControlObject;
  fabric.Object.prototype.selectable = canControlObject;
  fabric.Object.prototype.evented = canControlObject;
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
