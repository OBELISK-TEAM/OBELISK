export interface UndoRedoContext {
  saveCommand: (command: UndoRedoCommand) => void;
  undo: () => void;
  redo: () => void;
}

export interface UndoRedoCommand {
  redo: () => void;
  undo: () => void;
}
