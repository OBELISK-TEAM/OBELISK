import { fabric } from "fabric";
import { CanvasImage } from "@/interfaces/file-context";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { createCanvasObject } from "@/app/actions/slideActions";
import { toast } from "sonner";

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

export const addImage = async (
  canvas: fabric.Canvas | null,
  slideId: string,
  imageUrl: string,
  options?: { scaleX?: number; scaleY?: number; left?: number; top?: number },
  saveCommand?: (command: UndoRedoCommand) => void
): Promise<void> => {
  if (!canvas) {
    return;
  }

  const { scaleX = 1, scaleY = 1, left = 0, top = 0 } = options || {};
  try {
    fabric.Image.fromURL(imageUrl, async (img) => {
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

      const objectData = img.toJSON();
      try {
        const responseData = await createCanvasObject(slideId, objectData);
        Object.assign(img, { _id: responseData._id });
        canvas.add(img);
        canvas.setActiveObject(img);
      } catch (error: any) {
        console.error("Error creating image object on backend:", error);
        toast.error(error.message || "Failed to create image on backend");
      }
      if (!saveCommand) {
        return;
      }
      const command = new AddCommand(canvas, img.toJSON(["_id"]));
      saveCommand(command);
    });
  } catch (error: any) {
    console.error("Error loading image:", error);
    toast.error(error.message || "Failed to load image");
  }
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
