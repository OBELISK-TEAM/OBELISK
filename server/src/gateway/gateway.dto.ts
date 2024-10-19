import { ObjectTextStyles } from '../shared/interfaces/fabric-js/ObjectTextStyles';
import { ObjectFilter } from '../shared/interfaces/fabric-js/ObjectFilter';
import { ObjectPath } from '../shared/interfaces/fabric-js/ObjectPath';
import { ObjectShadow } from '../shared/interfaces/fabric-js/ObjectShadow';
import { Eraser } from 'src/mongo/schemas/object/base.object.schema';

export interface JoinBoardData {
  board: BoardOnlyId;
}

export interface JoinSlideData {
  slide: { slideNumber: number };
}

export interface AddSlideData {
  slide?: {
    slideNumber: number;
  };
}

export interface DeleteSlideData extends AddSlideData {}

export interface AddObjectData {
  object: ObjectDataProps;
}

export interface UpdateObjectData {
  object: ObjectDataPropsWithId;
}

export interface DeleteObjectData {
  object: ObjectOnlyId;
}

export interface BoardOnlyId extends OnlyId {}
export interface ObjectOnlyId extends OnlyId {}

export interface OnlyId {
  _id: string;
}

export interface ObjectDataPropsWithId extends ObjectDataProps {
  _id: string;
}

export interface ObjectDataProps {
  type?: string;
  version?: string;
  originX?: string;
  originY?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeLineCap?: 'butt' | 'round' | 'square';
  strokeDashOffset?: number;
  strokeLineJoin?: 'miter' | 'round' | 'bevel';
  strokeUniform?: boolean;
  strokeMiterLimit?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  flipX?: boolean;
  flipY?: boolean;
  opacity?: number;
  visible?: boolean;
  fillRule?: string;
  paintFirst?: 'fill' | 'stroke';
  globalCompositeOperation?: string;
  skewX?: number;
  skewY?: number;
  path?: ObjectPath[];
  shadow?: ObjectShadow | null;
  strokeDashArray?: number[] | null;
  stroke?: string | null;
  fill?: string | null;
  backgroundColor?: string;
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
  styles?: ObjectTextStyles[];
  direction?: 'ltr' | 'rtl';
  pathStartOffset?: number;
  pathSide?: 'left' | 'right' | 'center';
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';
  src?: string;
  crossOrigin?: 'null' | 'anonymous';
  cropX?: number;
  cropY?: number;
  filters?: ObjectFilter[];
  erasable?: boolean;
  eraser?: Eraser;
}
