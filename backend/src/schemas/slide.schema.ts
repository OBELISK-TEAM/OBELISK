import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Board } from './board.schema';
import { SlideObject } from './slide-object.schema';
import {
  Schema as MongooseSchema,
  Document as MongooseDocument,
  SchemaTimestampsConfig,
} from 'mongoose';

export type SlideDocument = Slide & MongooseDocument & SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class Slide {
  @Prop({
    required: true,
  })
  version: string;

  // relations

  @Prop({
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        required: true,
        ref: 'SlideObject',
      },
    ],
  })
  objects: SlideObject[];

  @Prop({
    required: true,
    type: Board,
  })
  board: Board;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);
