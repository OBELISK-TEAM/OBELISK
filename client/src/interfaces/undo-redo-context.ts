import { UndoRedoCommand } from "./canvas-action";

export interface UndoRedoContext {
  // saveAction: (action: CanvasActions, objectId: string, objectState?: any) => void;
  saveCommand: (command: UndoRedoCommand) => void;
  undo: () => void;
  redo: () => void;
}
