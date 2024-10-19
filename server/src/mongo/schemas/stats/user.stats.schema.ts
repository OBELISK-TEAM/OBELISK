import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from '../user.schema';

@Schema()
export class UserStats extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  lastActiveAt: Date | null;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  lastPasswordChange: Date | null;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: {},
  })
  lastBoardAccesed: { timestamp: Date; boardId: string };

  @Prop({
    type: Map,
    of: Number,
    required: false,
    default: {},
  })
  boardsVisits: Map<Types.ObjectId, number>;

  @Prop({
    type: Map,
    of: Number,
    required: false,
    default: {},
  })
  boardsInteractions: Map<Types.ObjectId, number>;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  loginLogoutTimeline: [{ loginDate: Date; logoutDate: Date | null }];
}

export const UserStatsSchema = SchemaFactory.createForClass(UserStats);
