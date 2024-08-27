import { BoardResponseObject } from './BoardResponseObject';

export interface SlideResponseObject {
  _id: string;
  board?: string | BoardResponseObject;
  objects?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
