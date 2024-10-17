import { Socket } from "socket.io-client";

export interface UndoRedoContext {
  saveCommand: (command: UndoRedoCommand) => void;
  undo: () => void;
  redo: () => void;
}

export interface UndoRedoCommand {
  redo: (socket: Socket) => void;
  undo: (socket: Socket) => void;
}
