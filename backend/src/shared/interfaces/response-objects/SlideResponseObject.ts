import { BoardResponseObject } from './BoardResponseObject';
import { SlideObjectResponseObject } from './SlideObjectResponseObject';

export interface SlideResponseObject {
  _id: string;
  board?: string | BoardResponseObject;
  objects?: string[] | SlideObjectResponseObject[];
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
}
