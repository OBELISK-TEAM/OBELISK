export interface UndoRedoCommand {
  redo: () => void;
  undo: () => void;
}
