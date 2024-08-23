export interface IUndoRedoContext {
  saveState: () => void;
  undo: () => void;
  redo: () => void;
}
