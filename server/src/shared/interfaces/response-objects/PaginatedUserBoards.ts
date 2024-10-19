import { SchemaTimestampsConfig } from 'mongoose';
import { UserPermission } from '../UserPermission';

export interface PaginatedBoardsResponseObject {
  boards: PopulatedBoardResponseObject[];
  page: number;
  limit: number;
  order: string;
  total: number;
}

export interface PopulatedBoardResponseObject {
  _id: string;
  name: string;
  permission: string;
  permissions: {
    viewer: UserPermission[];
    editor: UserPermission[];
    moderator: UserPermission[];
  };
  owner: UserPermission;
  slideCount: number;
  sizeInBytes: number;
  maxBoardSizeInBytes?: number;
  createdAt: SchemaTimestampsConfig['createdAt'];
  updatedAt: SchemaTimestampsConfig['updatedAt'];
}
