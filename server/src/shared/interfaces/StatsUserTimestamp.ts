import { Types } from 'mongoose';

export type StatsUserTimestamp = Array<{
  timestamp: Date;
  userId: Types.ObjectId;
}>;
