import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
        required: false,
        ref: 'SlideObject',
      },
    ],
  })
  objects: string[];

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Board',
  })
  board: string;
}

export const SlideSchema = SchemaFactory.createForClass(Slide);
