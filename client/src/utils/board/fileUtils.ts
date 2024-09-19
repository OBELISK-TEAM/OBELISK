import { fabric } from "fabric";
import { CanvasImage } from "@/interfaces/file-context";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { generateId } from "../randomUtils";

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

export const addImage = (
  canvas: fabric.Canvas | null,
  imageUrl: string,
  options?: { scaleX?: number; scaleY?: number; left?: number; top?: number },
  saveCommand?: (command: UndoRedoCommand) => void
): void => {
  if (!canvas) {
    return;
  }

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
    canvas.add(img);
    canvas.setActiveObject(img);

    if (!saveCommand) {
      return;
    }

    const id = generateId("img");
    Object.assign(img, { id });

    const command = new AddCommand(canvas, img);
    saveCommand(command);
  });
};

export const fitImageByShrinking = (
  imageSrc: string,
  maxWidth: number,
  maxHeight: number,
  callback: (resizedImage: string) => void
) => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => {
    const canvas = document.createElement("canvas");
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
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0, width, height);
    const resizedImage = canvas.toDataURL();
    callback(resizedImage);
  };
};
