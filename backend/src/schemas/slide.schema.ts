import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SlideDocument = Slide & Document;

@Schema()
export class Slide {
  @Prop({ required: true })
  version: string;

  @Prop({ type: [{ type: Object, required: true }] })
  objects: SlideObject[];
}

export const SlideSchema = SchemaFactory.createForClass(Slide);

export class SlideObject {
  type: string;
  version: string;
  originX: string;
  originY: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill: string | null;
  stroke: string | null;
  strokeWidth: number;
  strokeDashArray: number[] | null;
  strokeLineCap: 'butt' | 'round' | 'square';
  strokeDashOffset: number;
  strokeLineJoin: 'miter' | 'round' | 'bevel';
  strokeUniform: boolean;
  strokeMiterLimit: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  flipX: boolean;
  flipY: boolean;
  opacity: number;
  shadow: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  } | null;
  visible: boolean;
  backgroundColor: string;
  fillRule: string;
  paintFirst: 'fill' | 'stroke';
  globalCompositeOperation: string;
  skewX: number;
  skewY: number;
  path: Array<[string, number, number]>;
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
  rx?: number;
  ry?: number;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontSize?: number;
  text?: string;
  underline?: boolean;
  overline?: boolean;
  linethrough?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic';
  lineHeight?: number;
  textBackgroundColor?: string;
  charSpacing?: number;
  styles?: {
    [key: string]: {
      textDecoration: string;
    };
  }[];
  direction?: 'ltr' | 'rtl';
  pathStartOffset?: number;
  pathSide?: 'left' | 'right' | 'center';
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';
  src?: string;
  cropX?: number;
  cropY?: number;
  filters?: {
    type: string;
    value: number;
  }[];
}
