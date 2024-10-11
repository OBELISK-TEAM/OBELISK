import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatsUserTimestamp } from 'src/shared/interfaces/StatsUserTimestamp';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class BoardStats extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Board',
    required: true,
  })
  boardId: Types.ObjectId;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  lastAccessedAt: Date | null;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  viewTimeline: StatsUserTimestamp;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  shareTimeline: StatsUserTimestamp;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  editTimeline: StatsUserTimestamp;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  activeUsersTimeline: [{ timestamp: Date; usersCount: number }];

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  timeSpend: [
    { userId: Types.ObjectId; startDate: Date | null; endDate: Date | null },
  ];
}

export const BoardStatsSchema = SchemaFactory.createForClass(BoardStats);
