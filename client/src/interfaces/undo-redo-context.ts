import { UndoRedoCommand } from "./undo-redo-command";

export interface UndoRedoContext {
  // saveAction: (action: CanvasActions, objectId: string, objectState?: any) => void;
  saveCommand: (command: UndoRedoCommand) => void;
  undo: () => void;
  redo: () => void;
}
