"use client";
import React, { useEffect } from "react";
import { MenuActions } from "@/enums/MenuActions";
import { useUndoRedo } from "@/contexts/UndoRedoContext";
import { useMenuData } from "@/contexts/MenuDataContext";

const KeydownListenerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { undo, redo } = useUndoRedo();
  const { performAction } = useMenuData();

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
        performAction(MenuActions.REMOVE_SELECTED);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [performAction, undo, redo]);

  return <>{children}</>;
};

export default KeydownListenerWrapper;
