import { SlideResponseObject } from './SlideResponseObject';
import { SchemaTimestampsConfig, Types } from 'mongoose';

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
  slide?: SlideResponseObject | string;
  createdAt?: SchemaTimestampsConfig['createdAt'];
  updatedAt?: SchemaTimestampsConfig['updatedAt'];
  slidesCount?: number;
  permission?: string;
}
