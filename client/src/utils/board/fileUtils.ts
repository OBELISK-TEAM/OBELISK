import { fabric } from "fabric";
import { CanvasImage } from "@/interfaces/file-context";
import { UndoRedoCommand } from "@/interfaces/undo-redo-context";
import { AddCommand } from "@/classes/undo-redo-commands/AddCommand";
import { toast } from "sonner";
import { AddObjectData } from "@/interfaces/socket/SocketEmitsData";
import { assignId } from "../utils";

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
  socketEmitAddObject: (addObjectData: AddObjectData, callback: (res: string) => void) => void,
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

      canvas.add(img);
      canvas.setActiveObject(img);

      if (!saveCommand) {
        return;
      }

      try {
        // const responseData = await createCanvasObject(slideId, objectData);
        // Object.assign(img, { _id: responseData._id });

        const addObjectData: AddObjectData = {
          object: img.toJSON(),
          slide: { _id: slideId },
        };
        const callback = (res: string) => {
          assignId(img, res);
          const command = new AddCommand(canvas, img.toJSON(["_id"]));
          saveCommand(command);
        };

        socketEmitAddObject(addObjectData, callback);
      } catch (error: any) {
        console.error("Error creating image object:", error);
        toast.error(error.message || "Failed to create image");
      }
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
