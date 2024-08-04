import { fabric } from "fabric";
import { jsPDF } from "jspdf";

interface CanvasRef {
  current: HTMLCanvasElement | null;
}

interface CanvasImage {
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  src: string;
}

interface ImageData {
  src: string;
  left: number | undefined;
  top: number | undefined;
  scaleX: number | undefined;
  scaleY: number | undefined;
  angle: number | undefined;
}


export const initializeCanvas = (canvasRef: CanvasRef): fabric.Canvas | null => {
  if (canvasRef.current) {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      selection: true
    });

    newCanvas.freeDrawingBrush.color = "black";
    newCanvas.freeDrawingBrush.width = 5;
    newCanvas.freeDrawingBrush.decimate = 4;
    newCanvas.on('before:render', () => newCanvas.selection = false);
    newCanvas.on('after:render', () => newCanvas.selection = true);

    return newCanvas;
  }
  return null;
};

export const toggleDrawingMode = (canvas: fabric.Canvas | null, isDrawingMode: boolean): void => {
  if (canvas) {
    canvas.isDrawingMode = isDrawingMode;
  }
};

export const handleSave = (canvas: fabric.Canvas | null): void => {
  if (canvas) {
    const json = JSON.stringify(canvas.toJSON());
    //console.log("Saved JSON:", json);
  }
};

export const handleLoadFromJSON = async (canvas: fabric.Canvas | null): Promise<void> => {
  const response = await fetch("/saved.json");
  const jsonData = await response.json();
  if (canvas) {
    canvas.loadFromJSON(jsonData, () => canvas.renderAll());
  }
}

export const handleAddText = (
  canvas: fabric.Canvas | null,
  posX: number,
  posY: number,
  options?: { text?: string; color?: string; fontSize?: number }
): void => {
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
 
  canvas?.add(newText);
  canvas?.setActiveObject(newText);
  newText.enterEditing();
  newText.selectAll();
};



export const handleRemoveSelected = (canvas: fabric.Canvas | null): void => {
  if (canvas) {
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject().requestRenderAll();
  }
};

export const handleGroupSelected = (canvas: fabric.Canvas | null): void => {
  if (canvas) {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      const clonedObjects = activeObjects.map((obj) =>
        fabric.util.object.clone(obj)
      );

      const group = new fabric.Group(clonedObjects, {
        originX: "center",
        originY: "center",
      });

      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
    }
  }
};

export const addLine = (canvas: fabric.Canvas | null, options?: { color?: string; strokeWidth?: number }): void => {
  const { color = "black", strokeWidth = 5 } = options || {};
  const line = new fabric.Line([50, 100, 200, 200], {
    stroke: color,
    strokeWidth: strokeWidth,
    selectable: true,
  });
  canvas?.add(line);
  canvas?.setActiveObject(line);
};

export const addRectangle = (canvas: fabric.Canvas | null, options?: { fillColor?: string; width?: number; height?: number }): void => {
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
  canvas?.add(rect);
  canvas?.setActiveObject(rect);
};

export const addCircle = (canvas: fabric.Canvas | null, options?: { fillColor?: string; radius?: number }): void => {
  const { fillColor = "green", radius = 50 } = options || {};
  const circle = new fabric.Circle({
    radius: radius,
    fill: fillColor,
    left: 200,
    top: 200,
  });
  canvas?.add(circle);
  canvas?.setActiveObject(circle);
};

/**
 * Removes all images from the canva
 * @param canvas The canva to remove images from
 * @returns Removed images in a form of imagesData
 */
const removeImagesFromCanvas = (canvas:fabric.Canvas | null) => {
  const imageObjects = canvas?.getObjects('image') as fabric.Image[];
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

const restoreImagesToCanvas = (canvas:fabric.Canvas | null, imagesData:ImageData[]) => {
  imagesData.forEach((imgData:ImageData) => {
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

export const exportToPDF = async (canvas: fabric.Canvas | null): Promise<void> => {
  if (!canvas) return;

  const imagesData = removeImagesFromCanvas(canvas);

  const imgData = canvas.toDataURL({
    format: 'png',
    quality: 1,
  });

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.getWidth(), canvas.getHeight()],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.getWidth(), canvas.getHeight());
  pdf.save('canvas.pdf');

  restoreImagesToCanvas(canvas, imagesData);
};





export const addImage = (canvas: fabric.Canvas | null, imageUrl: string, options?: { scaleX?: number; scaleY?: number; left?: number; top?: number }): void => {
  const { scaleX = 1, scaleY = 1, left = 0, top = 0 } = options || {};
  fabric.Image.fromURL(imageUrl, (img) => {
    img.set({
      scaleX: scaleX,
      scaleY: scaleY,
      left: left,
      top: top,
      lockScalingFlip: false,
      lockUniScaling: false,
      lockRotation: false,
      lockMovementX: false,
      lockMovementY: false,
    });
    canvas?.add(img);
    canvas?.setActiveObject(img);
  });
};

export const fitImageByShrinking = (imageSrc: string, maxWidth: number, maxHeight: number, callback: (resizedImage: string) => void) => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0, width, height);
    const resizedImage = canvas.toDataURL();
    callback(resizedImage);
  };
};

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

export const saveImagesToLocalFile = (canvas: fabric.Canvas | null) => {
  if (canvas) {
    const images = canvas.getObjects('image').map((img) => {
      const image = img as fabric.Image;
      return {
        type: 'image',
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
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

export const loadImagesFromJSON = (canvas: fabric.Canvas | null, json: string) => {
  if (canvas) {
    const images: CanvasImage[] = JSON.parse(json);

    images.forEach((imgData) => {
      fabric.Image.fromURL(imgData.src, (img) => {
        img.set({
          left: imgData.left,
          top: imgData.top,
          scaleX: imgData.scaleX,
          scaleY: imgData.scaleY,
          angle: imgData.angle,
        });
        canvas.add(img);
      });
    });

    canvas.renderAll();
  }
};


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
  if (!canvas) return
    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => {
      obj.set(styles);
    });
    canvas.requestRenderAll();
};

export const updateDimensions = (obj: any) => {
  if (!obj) {
    return;
  }
  if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'line') {
    const scaledWidth = Math.round(obj.width * obj.scaleX);
    const scaledHeight = Math.round(obj.height * obj.scaleY);
    const scaledRadius = obj.radius ? Math.round(obj.radius * Math.max(obj.scaleX, obj.scaleY)) : undefined;

    obj.set({
      width: scaledWidth,
      height: scaledHeight,
      radius: scaledRadius,
      scaleX: 1,
      scaleY: 1,
    });
  }
  obj.setCoords();
};

