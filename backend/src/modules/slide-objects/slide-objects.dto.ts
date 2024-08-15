import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SlideObjectShadow } from '../../shared/interfaces/SlideObjectShadow';
import { SlideObjectPath } from '../../shared/interfaces/SlideObjectPath';
import { SlideObjectFilter } from '../../shared/interfaces/SlideObjectFilter';
import { SlideObjectTextStyles } from '../../shared/interfaces/SlideObjectTextStyles';

export class CreateSlideObjectDto {
  // Fabric.js-specific properties

  @IsString()
  type?: string;

  @IsString()
  version?: string;

  @IsString()
  originX?: string;

  @IsString()
  originY?: string;

  @IsNumber()
  left?: number;

  @IsNumber()
  top?: number;

  @IsNumber()
  @Min(0)
  width?: number;

  @IsNumber()
  @Min(0)
  height?: number;

  @IsNumber()
  @Min(0)
  strokeWidth?: number;

  @IsIn(['butt', 'round', 'square'])
  strokeLineCap?: 'butt' | 'round' | 'square';

  @IsNumber()
  strokeDashOffset?: number;

  @IsIn(['miter', 'round', 'bevel'])
  strokeLineJoin?: 'miter' | 'round' | 'bevel';

  @IsBoolean()
  strokeUniform?: boolean;

  @IsNumber()
  @Min(0)
  strokeMiterLimit?: number;

  @IsNumber()
  scaleX?: number;

  @IsNumber()
  scaleY?: number;

  @IsNumber()
  angle?: number;

  @IsBoolean()
  flipX?: boolean;

  @IsBoolean()
  flipY?: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  opacity?: number;

  @IsBoolean()
  visible?: boolean;

  @IsString()
  fillRule?: string;

  @IsIn(['fill', 'stroke'])
  paintFirst?: 'fill' | 'stroke';

  @IsString()
  globalCompositeOperation?: string;

  @IsNumber()
  skewX?: number;

  @IsNumber()
  skewY?: number;

  @IsArray()
  path?: SlideObjectPath;

  @Type(() => SlideObjectShadow)
  shadow?: SlideObjectShadow | null;

  @IsArray()
  strokeDashArray?: number[] | null;

  @IsString()
  stroke?: string | null;

  @IsString()
  fill?: string | null;

  @IsString()
  backgroundColor?: string;

  @IsNumber()
  x1?: number;

  @IsNumber()
  x2?: number;

  @IsNumber()
  y1?: number;

  @IsNumber()
  y2?: number;

  @IsNumber()
  rx?: number;

  @IsNumber()
  ry?: number;

  @IsNumber()
  @Min(0)
  radius?: number;

  @IsNumber()
  startAngle?: number;

  @IsNumber()
  endAngle?: number;

  @IsString()
  fontFamily?: string;

  @IsString()
  fontWeight?: string;

  @IsNumber()
  fontSize?: number;

  @IsString()
  text?: string;

  @IsBoolean()
  underline?: boolean;

  @IsBoolean()
  overline?: boolean;

  @IsBoolean()
  linethrough?: boolean;

  @IsIn(['left', 'center', 'right'])
  textAlign?: 'left' | 'center' | 'right';

  @IsIn(['normal', 'italic'])
  fontStyle?: 'normal' | 'italic';

  @IsNumber()
  lineHeight?: number;

  @IsString()
  textBackgroundColor?: string;

  @IsNumber()
  charSpacing?: number;

  @IsArray()
  styles?: SlideObjectTextStyles[];

  @IsIn(['ltr', 'rtl'])
  direction?: 'ltr' | 'rtl';

  @IsNumber()
  pathStartOffset?: number;

  @IsIn(['left', 'right', 'center'])
  pathSide?: 'left' | 'right' | 'center';

  @IsIn(['baseline', 'middle', 'top', 'bottom'])
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';

  @IsString()
  src?: string;

  @IsIn(['null', 'anonymous'])
  crossOrigin?: 'null' | 'anonymous';

  @IsNumber()
  cropX?: number;

  @IsNumber()
  cropY?: number;

  @IsArray()
  filters?: SlideObjectFilter[];

  // Relations

  @IsString()
  @IsNotEmpty()
  createdById: string;

  @IsString()
  @IsNotEmpty()
  slideId: string;
}

export class UpdateSlideObjectDto {
  // Fabric.js-specific properties

  @IsString()
  type?: string;

  @IsString()
  version?: string;

  @IsString()
  originX?: string;

  @IsString()
  originY?: string;

  @IsNumber()
  left?: number;

  @IsNumber()
  top?: number;

  @IsNumber()
  @Min(0)
  width?: number;

  @IsNumber()
  @Min(0)
  height?: number;

  @IsNumber()
  @Min(0)
  strokeWidth?: number;

  @IsIn(['butt', 'round', 'square'])
  strokeLineCap?: 'butt' | 'round' | 'square';

  @IsNumber()
  strokeDashOffset?: number;

  @IsIn(['miter', 'round', 'bevel'])
  strokeLineJoin?: 'miter' | 'round' | 'bevel';

  @IsBoolean()
  strokeUniform?: boolean;

  @IsNumber()
  @Min(0)
  strokeMiterLimit?: number;

  @IsNumber()
  scaleX?: number;

  @IsNumber()
  scaleY?: number;

  @IsNumber()
  angle?: number;

  @IsBoolean()
  flipX?: boolean;

  @IsBoolean()
  flipY?: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  opacity?: number;

  @IsBoolean()
  visible?: boolean;

  @IsString()
  fillRule?: string;

  @IsIn(['fill', 'stroke'])
  paintFirst?: 'fill' | 'stroke';

  @IsString()
  globalCompositeOperation?: string;

  @IsNumber()
  skewX?: number;

  @IsNumber()
  skewY?: number;

  @IsArray()
  path?: SlideObjectPath[];

  @Type(() => SlideObjectShadow)
  shadow?: SlideObjectShadow | null;

  @IsArray()
  strokeDashArray?: number[] | null;

  @IsString()
  stroke?: string | null;

  @IsString()
  fill?: string | null;

  @IsString()
  backgroundColor?: string;

  @IsNumber()
  x1?: number;

  @IsNumber()
  x2?: number;

  @IsNumber()
  y1?: number;

  @IsNumber()
  y2?: number;

  @IsNumber()
  rx?: number;

  @IsNumber()
  ry?: number;

  @IsNumber()
  @Min(0)
  radius?: number;

  @IsNumber()
  startAngle?: number;

  @IsNumber()
  endAngle?: number;

  @IsString()
  fontFamily?: string;

  @IsString()
  fontWeight?: string;

  @IsNumber()
  fontSize?: number;

  @IsString()
  text?: string;

  @IsBoolean()
  underline?: boolean;

  @IsBoolean()
  overline?: boolean;

  @IsBoolean()
  linethrough?: boolean;

  @IsIn(['left', 'center', 'right'])
  textAlign?: 'left' | 'center' | 'right';

  @IsIn(['normal', 'italic'])
  fontStyle?: 'normal' | 'italic';

  @IsNumber()
  lineHeight?: number;

  @IsString()
  textBackgroundColor?: string;

  @IsNumber()
  charSpacing?: number;

  @IsArray()
  styles?: SlideObjectTextStyles[];

  @IsIn(['ltr', 'rtl'])
  direction?: 'ltr' | 'rtl';

  @IsNumber()
  pathStartOffset?: number;

  @IsIn(['left', 'right', 'center'])
  pathSide?: 'left' | 'right' | 'center';

  @IsIn(['baseline', 'middle', 'top', 'bottom'])
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';

  @IsString()
  src?: string;

  @IsIn(['null', 'anonymous'])
  crossOrigin?: 'null' | 'anonymous';

  @IsNumber()
  cropX?: number;

  @IsNumber()
  cropY?: number;

  @IsArray()
  filters?: SlideObjectFilter[];
}
