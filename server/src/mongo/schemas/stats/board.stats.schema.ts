import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { SuperBoard } from '../board/super.board.schema';
import { User } from '../user.schema';
import { UserActionTimeline } from 'src/shared/interfaces/UserActionTimeline';

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class BoardStats extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SuperBoard.name,
    required: true,
  })
  boardId: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  ownerId: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  joinLeaveTimeline: [
    { userId: string; joinDate: Date; leaveDate: Date | null },
  ];

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  shareTimeline: UserActionTimeline;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  editTimeline: UserActionTimeline;
}

export const BoardStatsSchema = SchemaFactory.createForClass(BoardStats);
