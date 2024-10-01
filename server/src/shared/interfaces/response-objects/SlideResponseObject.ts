import { SlideObjectResponseObject } from './SlideObjectResponseObject';

export interface SlideResponseObject {
  _id: string;
  version: string;
  objects: SlideObjectResponseObject[];
}
