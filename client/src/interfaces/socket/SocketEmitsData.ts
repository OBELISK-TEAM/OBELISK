export interface JoinBoardData {
  board: { _id: string };
}

export interface JoinSlideData {
  slide: { slideNumber: number };
}

export interface AddSlideData {
  slide?: { slideNumber: number };
}

export interface DeleteSlideData extends AddSlideData {}

export interface AddObjectData {
  object: any;
}

export interface UpdateObjectData {
  object: any;
}

export interface DeleteObjectData {
  object: { _id: string };
}
