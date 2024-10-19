import { Prop } from '@nestjs/mongoose';
import { ObjectShadow } from '../../../shared/interfaces/fabric-js/ObjectShadow';
import { ObjectTextStyles } from '../../../shared/interfaces/fabric-js/ObjectTextStyles';
import { ObjectFilter } from '../../../shared/interfaces/fabric-js/ObjectFilter';
import { ObjectPath } from '../../../shared/interfaces/fabric-js/ObjectPath';
import { Schema as MongooseSchema } from 'mongoose';

export class BaseObject {
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
  path?: ObjectPath[];

  @Prop({
    default: null,
    type: ObjectShadow,
  })
  shadow?: ObjectShadow | null;

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
  styles?: ObjectTextStyles[];

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
  filters?: ObjectFilter[];

  @Prop({
    type: Boolean,
  })
  erasable?: boolean;
}

export class Eraser extends BaseObject {
  @Prop({
    type: [MongooseSchema.Types.Mixed],
  })
  objects?: BaseObject[];
}

export class BaseObjectWithEraser extends BaseObject {
  @Prop({
    type: MongooseSchema.Types.Mixed,
  })
  eraser?: Eraser;
}
