export interface CursorData {
  x: number;
  y: number;
  color: string;
  username: string;
}

export interface CursorRemoveData {
  userId: string;
}

export interface CursorEventData extends CursorData {
  userId: string;
}