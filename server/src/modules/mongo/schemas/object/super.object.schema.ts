import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseObjectWithEraser } from './base.object.schema';
import { Document as MongooseDocument, SchemaTimestampsConfig } from 'mongoose';

export type SuperObjectDocument = SuperObject &
  MongooseDocument &
  SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class SuperObject extends BaseObjectWithEraser {
  constructor(partial: Partial<SuperObject>) {
    super();
    Object.assign(this, partial);
  }
}

export const SuperObjectSchema = SchemaFactory.createForClass(SuperObject);
