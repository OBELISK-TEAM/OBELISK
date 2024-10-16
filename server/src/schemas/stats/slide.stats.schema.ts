import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { StatsUserTimestamp } from 'src/shared/interfaces/StatsUserTimestamp';
import { Schema as MongooseSchema } from 'mongoose';
import { SuperSlide } from '../slide/super.slide.schema';
import { User } from '../user.schema';

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
  slideId: Types.ObjectId;

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
  editTimeline: [
    {
      timestamp: Date;
      userId: Types.ObjectId;
      x: number;
      y: number;
      actionType: string;
    },
  ];

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: [],
  })
  objectsAddedTimeline: [{ timestamp: Date; objectsCount: number }];

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

export const SlideStatsSchema = SchemaFactory.createForClass(SlideStats);
