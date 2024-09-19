import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permissions } from '../shared/interfaces/Permissions';
import {
  Schema as MongooseSchema,
  Document as MongooseDocument,
  SchemaTimestampsConfig,
} from 'mongoose';

export type BoardDocument = Board & MongooseDocument & SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class Board {
  @Prop({
    required: false,
    type: String,
  })
  name: string;

  // relations

  @Prop({
    required: false,
    type: {
      viewer: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
      editor: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
      moderator: [
        {
          type: MongooseSchema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    default: {
      viewer: [],
      editor: [],
      moderator: [],
    },
    _id: false,
  })
  permissions: Permissions;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  owner: string;

  @Prop({
    required: false,
    type: [MongooseSchema.Types.ObjectId],
    ref: 'Slide',
    default: [],
  })
  slides: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);

// // TODO - set everywhere ObjectId type not string
BoardSchema.pre('save', async function (next) {
  if (this.slides.length === 0) {
    const emptySlide = await this.model('Slide').create({
      version: '5.3.0',
      board: this._id,
    });
    this.slides.push(emptySlide._id.toString());
  }
  next();
});
