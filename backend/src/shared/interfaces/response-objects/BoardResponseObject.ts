import { SlideResponseObject } from './SlideResponseObject';
import { SlideDocument } from '../../../schemas/slide.schema';

export interface BoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions: {
    edit: string[];
    view: string[];
    share: string[];
  };
  slides?: string[];
  slide?: SlideResponseObject | string | SlideDocument;
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
}
