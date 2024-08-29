import { BoardResponseObject } from './BoardResponseObject';
import { SlideObjectDocument } from '../../../schemas/slide-object.schema';

export interface SlideResponseObject {
  _id: string;
  board?: string | BoardResponseObject;
  objects?: string[] | SlideObjectDocument[];
  // TODO
  // objects: string[] | SlideObjectResponseObject[] | SlideObjectDocument[];
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
}
