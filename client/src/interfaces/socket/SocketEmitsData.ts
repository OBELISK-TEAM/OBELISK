export interface JoinBoardData {
  board: OnlyId;
}

export interface AddObjectData {
  object: any;
  slide: OnlyId;
}

export interface UpdateObjectData {
  object: any;
}

export interface DeleteObjectData {
  object: OnlyId;
  slide: OnlyId;
}

export interface OnlyId {
  _id: string;
}
