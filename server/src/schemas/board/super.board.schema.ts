import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument, SchemaTimestampsConfig } from 'mongoose';
import { BaseBoardWithSlidesAndPermissions } from './base.board.schema';
import { SuperSlide, SuperSlideDocument } from '../slide/super.slide.schema';

export type SuperBoardDocument = SuperBoard &
  MongooseDocument &
  SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class SuperBoard extends BaseBoardWithSlidesAndPermissions {}

export const SuperBoardSchema = SchemaFactory.createForClass(SuperBoard);

SuperBoardSchema.pre('save', function (next) {
  if (this.isNew && this.slides.length === 0) {
    this.slides.push(new SuperSlide() as SuperSlideDocument);
  }
  next();
});
