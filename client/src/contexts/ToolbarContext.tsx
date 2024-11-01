// ToolbarContext.tsx
import React, { createContext, useContext, ReactNode, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { fabric } from "fabric";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { ModifyCommand } from "@/classes/undo-redo-commands/ModifyCommand";
import { UpdateObjectData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitUpdateObject } from "@/lib/board/socketEmitUtils";
import logger from "@/lib/logger";
import { useCanvas } from "@/contexts/CanvasContext";
import { useSocket } from "@/contexts/SocketContext";
import { useUndoRedo } from "@/contexts/UndoRedoContext";

interface ToolbarContextProps {
  debouncedToolbarHandleChange: DebouncedToolbarHandleChange;
}

type DebouncedToolbarHandleChange = (
  key: string,
  modifiedObject: fabric.Object,
  oldValue: any,
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  canvas: fabric.Canvas,
  saveCommand: (command: ModifyCommand) => void
) => void;

const ToolbarContext = createContext<ToolbarContextProps | undefined>(undefined);

interface ToolbarProviderProps {
  children: ReactNode;
}

export const ToolbarProvider: React.FC<ToolbarProviderProps> = ({ children }) => {
  const { state: canvasState, handleStyleChange } = useCanvas();
  const { socket } = useSocket();
  const { saveCommand } = useUndoRedo();
  /**
   *useMemo is used to memoize any value, in this case a function returning a debounced function.
   * This is more appropriate because debounce returns a new function
   * and useMemo allows that returned function to be memoized.
   * **/
  const debouncedToolbarHandleChange: DebouncedToolbarHandleChange = useMemo(
    () =>
      debounce(
        (
          key: string,
          modifiedObject: fabric.Object,
          oldValue: any,
          socket: Socket<DefaultEventsMap, DefaultEventsMap>,
          canvas: fabric.Canvas,
          saveCommand: (command: ModifyCommand) => void
        ) => {
          if (!socket || !canvas) {
            return;
          }
          logger.log(`Debounced change to object style for key: ${key}`);

          const modifiedObjectJSON = modifiedObject.toJSON(["_id"]) as any;
          const clonedJSON = JSON.parse(JSON.stringify(modifiedObjectJSON));
          Object.assign(clonedJSON, { [key]: oldValue });

          const updateObjectData: UpdateObjectData = {
            object: modifiedObjectJSON,
          };
          socketEmitUpdateObject(socket, updateObjectData);

          const objectId: string = modifiedObjectJSON._id;
          const command = new ModifyCommand(canvas, clonedJSON, modifiedObjectJSON, objectId, handleStyleChange);
          saveCommand(command);
        },
        300
      ),
    [handleStyleChange]
  );

  return <ToolbarContext.Provider value={{ debouncedToolbarHandleChange }}>{children}</ToolbarContext.Provider>;
};

export const useToolbar = (): ToolbarContextProps => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error("useToolbar must be used within a ToolbarProvider");
  }
  return context;
};
