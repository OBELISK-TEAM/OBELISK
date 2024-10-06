import { useEffect } from "react";
import { fabric } from "fabric";
import { Socket } from "socket.io-client";
import { getItemById } from "@/lib/board/canvasUtils";

const useSocketListeners = (socket: Socket | null, canvas: fabric.Canvas | null) => {
  useEffect(() => {
    if (!canvas || !socket) {
      return;
    }

    function addObjectToCanvas(canvas: fabric.Canvas, objectJSON: any) {
      fabric.util.enlivenObjects(
        [objectJSON],
        (objects: fabric.Object[]) => {
          objects.forEach((o) => {
            canvas?.add(o);
          });
        },
        "fabric"
      );
    }

    function deleteObjectFromCanvas(canvas: fabric.Canvas, id: string) {
      const obj = getItemById(canvas, id);
      if (obj) {
        canvas.remove(obj);
        if (canvas.getActiveObjects().includes(obj)) {
          canvas.discardActiveObject();
        }
      }
    }

    function handleObjectAdded(res: any) {
      if (!canvas) {
        return;
      }
      addObjectToCanvas(canvas, res);
    }

    function handleObjectUpdated(res: any) {
      if (!canvas) {
        return;
      }
      deleteObjectFromCanvas(canvas, res._id);

      delete res.slide;
      addObjectToCanvas(canvas, res);
    }

    function handleObjectDeleted(res: any) {
      if (!canvas) {
        return;
      }
      deleteObjectFromCanvas(canvas, res._id);
    }

    const handlers = [
      { eventName: "object-added", handler: handleObjectAdded },
      { eventName: "object-updated", handler: handleObjectUpdated },
      { eventName: "object-deleted", handler: handleObjectDeleted },
    ];

    handlers.forEach(({ eventName, handler }) => {
      socket.on(eventName, handler);
    });

    return () => {
      handlers.forEach(({ eventName, handler }) => {
        socket.off(eventName, handler);
      });
    };
  }, [canvas, socket]);
};

export default useSocketListeners;
