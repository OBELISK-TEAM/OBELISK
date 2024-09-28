import { SlideResponseObject } from './SlideResponseObject';
import { SuperSlideDocument } from '../../../schemas/slide/super.slide.schema';

export interface BoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions: {
    viewer: string[];
    editor: string[];
    moderator: string[];
  };
  slides?: string[];
  slide?: SlideResponseObject | string | SuperSlideDocument;
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
}
