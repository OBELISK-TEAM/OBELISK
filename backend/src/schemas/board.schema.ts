import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
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
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      view: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      share: [
        {
          type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    required: false,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Slide',
    default: [],
  })
  slides: Slide[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
