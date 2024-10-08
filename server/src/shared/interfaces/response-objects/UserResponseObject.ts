import { SchemaTimestampsConfig } from 'mongoose';

export interface UserResponseObject {
  _id: string;
  email: string;
  userRole: number;
  userAuthProvider: number;
  boards?: string[];
  slideObjects?: string[];
  lastActive?: Date;
  createdAt?: SchemaTimestampsConfig['createdAt'];
  updatedAt?: SchemaTimestampsConfig['updatedAt'];
}
