import { SlideResponseObject } from './SlideResponseObject';
import { SuperSlideDocument } from '../../../schemas/slide/super.slide.schema';
import { Types } from 'mongoose';

export interface BoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions?: {
    viewer: string[];
    editor: string[];
    moderator: string[];
  };
  slides?: string[] | Types.ObjectId[];
  slide?: SlideResponseObject | string | SuperSlideDocument;
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
  slidesCount?: number;
  permission?: string;
}
