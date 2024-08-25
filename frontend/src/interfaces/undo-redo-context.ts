export interface UndoRedoContext {
  saveState: () => void;
  undo: () => void;
  redo: () => void;
}
