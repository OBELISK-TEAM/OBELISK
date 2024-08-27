import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Slide } from './slide.schema';
import { SlideObjectShadow } from '../shared/interfaces/SlideObjectShadow';
import { SlideObjectPath } from '../shared/interfaces/SlideObjectPath';
import { SlideObjectFilter } from '../shared/interfaces/SlideObjectFilter';
import { SlideObjectTextStyles } from '../shared/interfaces/SlideObjectTextStyles';
import {
  Schema as MongooseSchema,
  Document as MongooseDocument,
  SchemaTimestampsConfig,
} from 'mongoose';

export type SlideObjectDocument = SlideObject &
  MongooseDocument &
  SchemaTimestampsConfig;

@Schema({
  timestamps: true,
  versionKey: false,
  validateBeforeSave: true,
})
export class SlideObject {
  // Fabric.js-specific properties

  @Prop({
    type: String,
  })
  type?: string;

  @Prop({
    type: String,
  })
  version?: string;

  @Prop({
    type: String,
  })
  originX?: string;

  @Prop({
    type: String,
  })
  originY?: string;

  @Prop({
    type: Number,
  })
  left?: number;

  @Prop({
    type: Number,
  })
  top?: number;

  @Prop({
    type: Number,
  })
  width?: number;

  @Prop({
    type: Number,
  })
  height?: number;

  @Prop({
    type: Number,
  })
  strokeWidth?: number;

  @Prop({
    enum: ['butt', 'round', 'square'],
  })
  strokeLineCap?: 'butt' | 'round' | 'square';

  @Prop({
    type: Number,
  })
  strokeDashOffset?: number;

  @Prop({
    enum: ['miter', 'round', 'bevel'],
  })
  strokeLineJoin?: 'miter' | 'round' | 'bevel';

  @Prop({
    type: Boolean,
  })
  strokeUniform?: boolean;

  @Prop({
    type: Number,
  })
  strokeMiterLimit?: number;

  @Prop({
    type: Number,
  })
  scaleX?: number;

  @Prop({
    type: Number,
  })
  scaleY?: number;

  @Prop({
    type: Number,
  })
  angle?: number;

  @Prop({
    type: Boolean,
  })
  flipX?: boolean;

  @Prop({
    type: Boolean,
  })
  flipY?: boolean;

  @Prop({
    type: Number,
  })
  opacity?: number;

  @Prop({
    type: Boolean,
  })
  visible?: boolean;

  @Prop({
    type: String,
  })
  fillRule?: string;

  @Prop({
    enum: ['fill', 'stroke'],
  })
  paintFirst?: 'fill' | 'stroke';

  @Prop({
    type: String,
  })
  globalCompositeOperation?: string;

  @Prop({
    type: Number,
  })
  skewX?: number;

  @Prop({
    type: Number,
  })
  skewY?: number;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
  })
  path?: SlideObjectPath[];

  @Prop({
    default: null,
    type: SlideObjectShadow,
  })
  shadow?: SlideObjectShadow | null;

  @Prop({
    default: null,
    type: [Number],
  })
  strokeDashArray?: number[] | null;

  @Prop({
    default: null,
    type: String,
  })
  stroke?: string | null;

  @Prop({
    default: null,
    type: String,
  })
  fill?: string | null;

  @Prop({
    type: String,
  })
  backgroundColor?: string;

  @Prop({
    type: Number,
  })
  x1?: number;

  @Prop({
    type: Number,
  })
  x2?: number;

  @Prop({
    type: Number,
  })
  y1?: number;

  @Prop({
    type: Number,
  })
  y2?: number;

  @Prop({
    type: Number,
  })
  rx?: number;

  @Prop({
    type: Number,
  })
  ry?: number;

  @Prop({
    type: Number,
  })
  radius?: number;

  @Prop({
    type: Number,
  })
  startAngle?: number;

  @Prop({
    type: Number,
  })
  endAngle?: number;

  @Prop({
    type: String,
  })
  fontFamily?: string;

  @Prop({
    type: String,
  })
  fontWeight?: string;

  @Prop({
    type: Number,
  })
  fontSize?: number;

  @Prop({
    type: String,
  })
  text?: string;

  @Prop({
    type: Boolean,
  })
  underline?: boolean;

  @Prop({
    type: Boolean,
  })
  overline?: boolean;

  @Prop({
    type: Boolean,
  })
  linethrough?: boolean;

  @Prop({
    enum: ['left', 'center', 'right'],
  })
  textAlign?: 'left' | 'center' | 'right';

  @Prop({
    enum: ['normal', 'italic'],
  })
  fontStyle?: 'normal' | 'italic';

  @Prop({
    type: Number,
  })
  lineHeight?: number;

  @Prop({
    type: String,
  })
  textBackgroundColor?: string;

  @Prop({
    type: Number,
  })
  charSpacing?: number;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
  })
  styles?: SlideObjectTextStyles[];

  @Prop({
    enum: ['ltr', 'rtl'],
  })
  direction?: 'ltr' | 'rtl';

  @Prop({
    type: Number,
  })
  pathStartOffset?: number;

  @Prop({
    enum: ['left', 'right', 'center'],
  })
  pathSide?: 'left' | 'right' | 'center';

  @Prop({
    enum: ['baseline', 'middle', 'top', 'bottom'],
  })
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';

  @Prop({
    type: String,
  })
  src?: string;

  @Prop({
    enum: ['null', 'anonymous'],
  })
  crossOrigin?: 'null' | 'anonymous';

  @Prop({
    type: Number,
  })
  cropX?: number;

  @Prop({
    type: Number,
  })
  cropY?: number;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
  })
  filters?: SlideObjectFilter[];

  // relations

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  createdBy: User;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Slide',
  })
  slide: Slide;
}

export const SlideObjectSchema = SchemaFactory.createForClass(SlideObject);
