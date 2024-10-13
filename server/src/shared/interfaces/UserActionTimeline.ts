import { Types } from 'mongoose';

export type UserActionTimeline = Array<{
  timestamp: Date;
  userId: Types.ObjectId;
}>;
