import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatsUserTimestamp } from 'src/shared/interfaces/StatsUserTimestamp';
import { Schema as MongooseSchema } from 'mongoose';
import { SuperBoard } from '../board/super.board.schema';
import { User } from '../user.schema';

@Schema()
export class BoardStats extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SuperBoard.name,
    required: true,
  })
  boardId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  ownerId: Types.ObjectId;

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
  timeSpent: [
    { userId: Types.ObjectId; startDate: Date; endDate: Date | null },
  ];
}

export const BoardStatsSchema = SchemaFactory.createForClass(BoardStats);
