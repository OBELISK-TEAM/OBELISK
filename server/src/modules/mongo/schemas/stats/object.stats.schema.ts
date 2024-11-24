import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SuperObject } from '../object/super.object.schema';
import { User } from '../user.schema';
import { Schema as MongooseSchema } from 'mongoose';
import { SuperBoard } from '../board/super.board.schema';
import { SuperSlide } from '../slide/super.slide.schema';
import { ObjectAction } from 'src/shared/enums/actions/object.action';

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class ObjectStats extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SuperObject.name,
    required: true,
  })
  objectId: string;

  @Prop({
    type: Types.ObjectId,
    ref: SuperBoard.name,
    required: true,
  })
  boardId: string;

  @Prop({
    type: Types.ObjectId,
    ref: SuperSlide.name,
    required: true,
  })
  slideId: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  creatorId: string;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: false,
    default: null,
  })
  lastInteraction: {
    userId: string;
    timestamp: Date;
    action: ObjectAction;
  };
}

export const ObjectStatsSchema = SchemaFactory.createForClass(ObjectStats);
