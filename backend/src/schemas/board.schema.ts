import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Slide } from './slide.schema';

export type BoardDocument = HydratedDocument<Board>;

@Schema()
export class Board {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop({
    required: false,
    type: String,
    unique: true,
  })
  name: string;

  // owner has all permissions
  @Prop({
    required: false,
    type: {
      edit: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      view: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      share: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    default: { edit: [], view: [], share: [] },
  })
  permissions: {
    edit: User[];
    view: User[];
    share: User[];
  };

  @Prop({
    required: false,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Slide',
    default: [],
  })
  slides: Slide[];

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  created: Date;

  @Prop({
    required: false,
    type: Date,
    default: Date.now,
  })
  updated: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
