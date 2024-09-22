import {
  CustomSlideObject,
  CustomSlideObjectWithId,
} from '../shared/interfaces/CustomSlideObject';

export interface AddObjectData {
  object: CustomSlideObject;
  slide: ObjectOnlyId;
}

export interface UpdateObjectData {
  object: CustomSlideObjectWithId;
}

export interface DeleteObjectData {
  object: ObjectOnlyId;
  slide: ObjectOnlyId;
}

export interface JoinBoardData {
  board: {
    boardId: string;
  };
}

export interface ObjectOnlyId {
  _id: string;
}
