import { UndoRedoCommand } from "./undo-redo-command";

export interface UndoRedoContext {
  saveCommand: (command: UndoRedoCommand) => void;
  undo: () => void;
  redo: () => void;
  listenersOn: boolean;
  setListenersOn: (newValue: boolean) => void;
}
