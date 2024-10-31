import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { SuperSlide } from '../slide/super.slide.schema';
import { User } from '../user.schema';
import { SuperBoard } from '../board/super.board.schema';
import { SlideAction } from 'src/shared/enums/actions/slide.action';

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class SlideStats extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SuperSlide.name,
    required: true,
  })
  slideId: string;

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
  editTimeline: [
    {
      timestamp: Date;
      userId: string;
      x: number;
      y: number;
      action: SlideAction;
    },
  ];
}

export const SlideStatsSchema = SchemaFactory.createForClass(SlideStats);
