import { ObjectResponseObject } from './ObjectResponseObject';

export interface SlideResponseObject {
  _id: string;
  version: string;
  objects: ObjectResponseObject[];
}
