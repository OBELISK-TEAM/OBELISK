import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Slide } from './slide.schema';

@Schema({ timestamps: true })
export class Board {
  @Prop({
    required: false,
    type: String,
  })
  name: string;

  @Prop({
    required: false,
    type: {
      edit: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
      view: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
      share: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    default: {
      edit: [],
      view: [],
      share: [],
    },
  })
  permissions: {
    edit: User[];
    view: User[];
    share: User[];
  };

  // relations

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    required: false,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Slide',
    default: [],
  })
  slides: Slide[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
