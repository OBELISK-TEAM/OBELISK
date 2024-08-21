import { useEffect } from "react";
import { MenuActions } from "@/enums/MenuActions";

const useKeydownListener = (performAction: (name: MenuActions) => void, undo: () => void, redo: () => void) => {
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
        performAction(MenuActions.RemoveSelected);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [performAction, undo, redo]);
};

export default useKeydownListener;
