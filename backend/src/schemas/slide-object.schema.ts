import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Slide } from './slide.schema';
import { SlideObjectShadow } from '../shared/interfaces/SlideObjectShadow';
import { SlideObjectPath } from '../shared/interfaces/SlideObjectPath';
import {
  Schema as MongooseSchema,
  Document as MongooseDocument,
} from 'mongoose';
import { SlideObjectFilter } from '../shared/interfaces/SlideObjectFilter';
import { SlideObjectTextStyles } from '../shared/interfaces/SlideObjectTextStyles';

export type SlideObjectDocument = SlideObject & MongooseDocument;

@Schema({ timestamps: true })
export class SlideObject {
  // Fabric.js-specific properties

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  version: string;

  @Prop({
    required: true,
  })
  originX: string;

  @Prop({
    required: true,
  })
  originY: string;

  @Prop({
    required: true,
  })
  left: number;

  @Prop({
    required: true,
  })
  top: number;

  @Prop({
    required: true,
  })
  width: number;

  @Prop({
    required: true,
  })
  height: number;

  @Prop({
    type: String,
    default: null,
  })
  fill: string | null;

  @Prop({
    type: String,
    default: null,
  })
  stroke: string | null;

  @Prop({
    required: true,
  })
  strokeWidth: number;

  @Prop({
    type: [Number],
    default: null,
  })
  strokeDashArray: number[] | null;

  @Prop({
    required: true,
    enum: ['butt', 'round', 'square'],
  })
  strokeLineCap: 'butt' | 'round' | 'square';

  @Prop({
    required: true,
  })
  strokeDashOffset: number;

  @Prop({
    required: true,
    enum: ['miter', 'round', 'bevel'],
  })
  strokeLineJoin: 'miter' | 'round' | 'bevel';

  @Prop({
    required: true,
  })
  strokeUniform: boolean;

  @Prop({
    required: true,
  })
  strokeMiterLimit: number;

  @Prop({
    required: true,
  })
  scaleX: number;

  @Prop({
    required: true,
  })
  scaleY: number;

  @Prop({
    required: true,
  })
  angle: number;

  @Prop({
    required: true,
  })
  flipX: boolean;

  @Prop({
    required: true,
  })
  flipY: boolean;

  @Prop({
    required: true,
  })
  opacity: number;

  @Prop({
    type: SlideObjectShadow,
    default: null,
  })
  shadow: SlideObjectShadow | null;

  @Prop({
    required: true,
  })
  visible: boolean;

  @Prop({
    required: true,
  })
  backgroundColor: string;

  @Prop({
    required: true,
  })
  fillRule: string;

  @Prop({
    required: true,
    enum: ['fill', 'stroke'],
  })
  paintFirst: 'fill' | 'stroke';

  @Prop({
    required: true,
  })
  globalCompositeOperation: string;

  @Prop({
    required: true,
  })
  skewX: number;

  @Prop({
    required: true,
  })
  skewY: number;

  @Prop({
    type: [MongooseSchema.Types.Mixed],
    required: true,
  })
  path: SlideObjectPath[];

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
