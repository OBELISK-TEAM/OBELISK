export interface UndoRedoContextI {
  saveState: () => void;
  undo: () => void;
  redo: () => void;
}
