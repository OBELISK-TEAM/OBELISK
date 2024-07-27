import { useEffect } from "react";
import { fabric } from "fabric";

const useKeydownListener = (
  canvas: fabric.Canvas | null,
  performAction: (name: string, canvas: fabric.Canvas | null) => void,
  undo: () => void,
  redo: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        switch (event.key) {
          case "z":
            undo();
            break;
          case "y":
            redo();
            break;
          case "Z":
            if (event.shiftKey) {
              redo();
            }
            break;
        }
      } else if (event.key === "Delete") {
        performAction("remove-selected", canvas);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas, performAction, undo, redo]);
};

export default useKeydownListener;
