import { Document as MongooseDocument, SchemaTimestampsConfig } from 'mongoose';
import { BaseSlideWithObjects } from './base.slide.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type SuperSlideDocument = SuperSlide &
  MongooseDocument &
  SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class SuperSlide extends BaseSlideWithObjects {}

export const SuperSlideSchema = SchemaFactory.createForClass(SuperSlide);
