import { fabric } from "fabric";
import { jsPDF } from "jspdf";
import { ImageData } from "@/interfaces/menu-data-context";
import { CanvasMode } from "@/enums/CanvasMode";
import { BrushOptions } from "@/enums/BrushOptions";

const configureBrush = (brush: fabric.BaseBrush, size: number, color?: string) => {
  brush.width = size;
  brush.decimate = BrushOptions.DECIMATE;
  if (color) {
    brush.color = color;
  }
};
export const setSelectionMode = (setCanvasMode: (mode: CanvasMode) => void) => {
  setCanvasMode(CanvasMode.SELECTION);
};

export const setDrawingMode = (
  canvas: fabric.Canvas | null,
  color: string,
  size: number,
  setCanvasMode: (mode: CanvasMode) => void
) => {
  if (!canvas) {
    return;
  }
  const pencilBrush = new fabric.PencilBrush(canvas);
  configureBrush(pencilBrush, size, color);
  canvas.freeDrawingBrush = pencilBrush;
  setCanvasMode(CanvasMode.SIMPLE_DRAWING);
};

export const setEraserMode = (
  canvas: fabric.Canvas | null,
  size: number,
  setCanvasMode: (mode: CanvasMode) => void
) => {
  if (!canvas) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const eraserBrush = new fabric.EraserBrush(canvas);
  configureBrush(eraserBrush, size);
  canvas.freeDrawingBrush = eraserBrush;
  setCanvasMode(CanvasMode.ERASER);
};

export const handleSave = (canvas: fabric.Canvas | null): void => {
  if (canvas) {
    const json = JSON.stringify(canvas.toJSON());
    console.log("Saved JSON:", json);
  }
};

export const handleLoadFromJSON = async (canvas: fabric.Canvas | null): Promise<void> => {
  // console.log("WYKONUJE SIE");
  const response = await fetch("/saved.json");
  const jsonData = await response.json();
  // console.log("Loaded JSON:", jsonData);
  if (canvas) {
    canvas.loadFromJSON(jsonData, () => canvas.renderAll());
  }
};

export const instantiateText = (
  canvas: fabric.Canvas | null,
  posX: number,
  posY: number,
  options?: { text?: string; color?: string; fontSize?: number }
): fabric.IText => {
  const { text = "Type here...", color = "#333", fontSize = 20 } = options || {};

  const newText = new fabric.IText(text, {
    left: posX,
    top: posY,
    fontFamily: "arial",
    fill: color,
    fontSize: fontSize,
    lockScalingY: true,
    lockScalingX: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockScalingFlip: true,
  });
  return newText;
};

export const removeSelectedObjects = (canvas: fabric.Canvas | null): fabric.Object[] | undefined => {
  if (!canvas) {
    return;
  }

  const activeObjects = canvas.getActiveObjects();
  canvas.remove(...activeObjects);
  canvas.discardActiveObject().requestRenderAll();

  return activeObjects;
};

/**
 * Create a group consisting of given objects
 * @param canvas fabric.Canvas
 * @returns Created group of fabric.Group type
 */
export const instantiateGroupOfObjects = (
  canvas: fabric.Canvas,
  activeObjects: fabric.Object[]
): fabric.Group | undefined => {
  if (!activeObjects.length) {
    return;
  }

  const clonedObjects = activeObjects.map((obj) => fabric.util.object.clone(obj));

  const group = new fabric.Group(clonedObjects, {
    originX: "center",
    originY: "center",
  });
  return group;
};

export const instantiateLine = (
  canvas: fabric.Canvas | null,
  options?: { color?: string; width?: number; height?: number }
): fabric.Line => {
  const { color = "black", width, height } = options || {};
  const line = new fabric.Line([50, 100, 200, 200], {
    stroke: color,
    width: width,
    strokeWidth: 5,
    height: height,
    selectable: true,
  });
  return line;
};

export const instantiateRectangle = (
  canvas: fabric.Canvas | null,
  options?: { fillColor?: string; width?: number; height?: number }
): fabric.Rect => {
  const { fillColor = "red", width = 200, height = 100 } = options || {};
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: fillColor,
    width: width,
    height: height,
    angle: 0,
    transparentCorners: false,
  });
  return rect;
};

export const instantiateCircle = (
  canvas: fabric.Canvas | null,
  options?: { fillColor?: string; radius?: number }
): fabric.Circle => {
  const { fillColor = "green", radius = 50 } = options || {};
  const circle = new fabric.Circle({
    radius: radius,
    fill: fillColor,
    left: 200,
    top: 200,
  });
  return circle;
};

export const exportToPDF = async (canvas: fabric.Canvas | null): Promise<void> => {
  if (!canvas) {
    return;
  }

  const imagesData = removeImagesFromCanvas(canvas);

  const imgData = canvas.toDataURL({
    format: "png",
    quality: 1,
  });

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.getWidth(), canvas.getHeight()],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.getWidth(), canvas.getHeight());
  pdf.save("canvas.pdf");

  restoreImagesToCanvas(canvas, imagesData);
};

/**
 * Removes all images from the canva
 * @param canvas The canva to remove images from
 * @returns Removed images in a form of imagesData
 */
const removeImagesFromCanvas = (canvas: fabric.Canvas | null) => {
  const imageObjects = canvas?.getObjects("image") as fabric.Image[];
  const imagesData = imageObjects.map((imageObj) => ({
    src: imageObj.getSrc(),
    left: imageObj.left,
    top: imageObj.top,
    scaleX: imageObj.scaleX,
    scaleY: imageObj.scaleY,
    angle: imageObj.angle,
  }));
  imageObjects.forEach((imageObj) => canvas?.remove(imageObj));
  canvas?.renderAll();
  return imagesData;
};

const restoreImagesToCanvas = (canvas: fabric.Canvas | null, imagesData: ImageData[]) => {
  imagesData.forEach((imgData: ImageData) => {
    fabric.Image.fromURL(imgData.src, (img) => {
      img.set({
        left: imgData.left,
        top: imgData.top,
        scaleX: imgData.scaleX,
        scaleY: imgData.scaleY,
        angle: imgData.angle,
      });
      canvas?.add(img);
    });
  });
  canvas?.renderAll();
};

export const saveImagesToLocalFile = (canvas: fabric.Canvas | null) => {
  if (canvas) {
    const images = canvas.getObjects("image").map((img) => {
      const image = img as fabric.Image;
      return {
        type: "image",
        left: image.left,
        top: image.top,
        width: image.width,
        height: image.height,
        scaleX: image.scaleX,
        scaleY: image.scaleY,
        angle: image.angle,
        src: image.getSrc(),
      };
    });

    const jsonContent = JSON.stringify(images, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
