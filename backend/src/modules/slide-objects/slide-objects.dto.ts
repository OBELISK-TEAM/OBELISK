import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SlideObjectShadow } from 'src/shared/interfaces/SlideObjectShadow';
import { SlideObjectPath } from 'src/shared/interfaces/SlideObjectPath';
import { SlideObjectFilter } from 'src/shared/interfaces/SlideObjectFilter';
import { SlideObjectTextStyles } from 'src/shared/interfaces/SlideObjectTextStyles';

export class CreateSlideObjectDto {
  // Fabric.js-specific properties

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  originX: string;

  @IsString()
  @IsNotEmpty()
  originY: string;

  @IsNumber()
  @IsNotEmpty()
  left: number;

  @IsNumber()
  @IsNotEmpty()
  top: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  height: number;

  @IsString()
  @IsOptional()
  fill: string | null;

  @IsString()
  @IsOptional()
  stroke: string | null;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  strokeWidth: number;

  @IsArray()
  @IsOptional()
  strokeDashArray: number[] | null;

  @IsIn(['butt', 'round', 'square'])
  @IsNotEmpty()
  strokeLineCap: 'butt' | 'round' | 'square';

  @IsNumber()
  @IsNotEmpty()
  strokeDashOffset: number;

  @IsIn(['miter', 'round', 'bevel'])
  @IsNotEmpty()
  strokeLineJoin: 'miter' | 'round' | 'bevel';

  @IsBoolean()
  @IsNotEmpty()
  strokeUniform: boolean;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  strokeMiterLimit: number;

  @IsNumber()
  @IsNotEmpty()
  scaleX: number;

  @IsNumber()
  @IsNotEmpty()
  scaleY: number;

  @IsNumber()
  @IsNotEmpty()
  angle: number;

  @IsBoolean()
  @IsNotEmpty()
  flipX: boolean;

  @IsBoolean()
  @IsNotEmpty()
  flipY: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsNotEmpty()
  opacity: number;

  @Type(() => SlideObjectShadow)
  @IsOptional()
  shadow: SlideObjectShadow | null;

  @IsBoolean()
  @IsNotEmpty()
  visible: boolean;

  @IsString()
  @IsOptional()
  backgroundColor: string;

  @IsString()
  @IsOptional()
  fillRule: string;

  @IsIn(['fill', 'stroke'])
  @IsNotEmpty()
  paintFirst: 'fill' | 'stroke';

  @IsString()
  @IsNotEmpty()
  globalCompositeOperation: string;

  @IsNumber()
  @IsNotEmpty()
  skewX: number;

  @IsNumber()
  @IsNotEmpty()
  skewY: number;

  @IsArray()
  @IsNotEmpty()
  path: SlideObjectPath;

  @IsNumber()
  @IsOptional()
  x1?: number;

  @IsNumber()
  @IsOptional()
  x2?: number;

  @IsNumber()
  @IsOptional()
  y1?: number;

  @IsNumber()
  @IsOptional()
  y2?: number;

  @IsNumber()
  @IsOptional()
  rx?: number;

  @IsNumber()
  @IsOptional()
  ry?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  radius?: number;

  @IsNumber()
  @IsOptional()
  startAngle?: number;

  @IsNumber()
  @IsOptional()
  endAngle?: number;

  @IsString()
  @IsOptional()
  fontFamily?: string;

  @IsString()
  @IsOptional()
  fontWeight?: string;

  @IsNumber()
  @IsOptional()
  fontSize?: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  underline?: boolean;

  @IsBoolean()
  @IsOptional()
  overline?: boolean;

  @IsBoolean()
  @IsOptional()
  linethrough?: boolean;

  @IsIn(['left', 'center', 'right'])
  @IsOptional()
  textAlign?: 'left' | 'center' | 'right';

  @IsIn(['normal', 'italic'])
  @IsOptional()
  fontStyle?: 'normal' | 'italic';

  @IsNumber()
  @IsOptional()
  lineHeight?: number;

  @IsString()
  @IsOptional()
  textBackgroundColor?: string;

  @IsNumber()
  @IsOptional()
  charSpacing?: number;

  @IsArray()
  @IsOptional()
  styles?: SlideObjectTextStyles[];

  @IsIn(['ltr', 'rtl'])
  @IsOptional()
  direction?: 'ltr' | 'rtl';

  @IsNumber()
  @IsOptional()
  pathStartOffset?: number;

  @IsIn(['left', 'right', 'center'])
  @IsOptional()
  pathSide?: 'left' | 'right' | 'center';

  @IsIn(['baseline', 'middle', 'top', 'bottom'])
  @IsOptional()
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';

  @IsString()
  @IsOptional()
  src?: string;

  @IsIn(['null', 'anonymous'])
  @IsOptional()
  crossOrigin?: 'null' | 'anonymous';

  @IsNumber()
  @IsOptional()
  cropX?: number;

  @IsNumber()
  @IsOptional()
  cropY?: number;

  @IsArray()
  @IsOptional()
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
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  originX?: string;

  @IsString()
  @IsOptional()
  originY?: string;

  @IsNumber()
  @IsOptional()
  left?: number;

  @IsNumber()
  @IsOptional()
  top?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  width?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  height?: number;

  @IsString()
  @IsOptional()
  fill?: string | null;

  @IsString()
  @IsOptional()
  stroke?: string | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  strokeWidth?: number;

  @IsArray()
  @IsOptional()
  strokeDashArray?: number[] | null;

  @IsIn(['butt', 'round', 'square'])
  @IsOptional()
  strokeLineCap?: 'butt' | 'round' | 'square';

  @IsNumber()
  @IsOptional()
  strokeDashOffset?: number;

  @IsIn(['miter', 'round', 'bevel'])
  @IsOptional()
  strokeLineJoin?: 'miter' | 'round' | 'bevel';

  @IsBoolean()
  @IsOptional()
  strokeUniform?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  strokeMiterLimit?: number;

  @IsNumber()
  @IsOptional()
  scaleX?: number;

  @IsNumber()
  @IsOptional()
  scaleY?: number;

  @IsNumber()
  @IsOptional()
  angle?: number;

  @IsBoolean()
  @IsOptional()
  flipX?: boolean;

  @IsBoolean()
  @IsOptional()
  flipY?: boolean;

  @IsNumber()
  @Min(0)
  @Max(1)
  @IsOptional()
  opacity?: number;

  @Type(() => SlideObjectShadow)
  @IsOptional()
  shadow?: SlideObjectShadow | null;

  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @IsString()
  @IsOptional()
  backgroundColor?: string;

  @IsString()
  @IsOptional()
  fillRule?: string;

  @IsIn(['fill', 'stroke'])
  @IsOptional()
  paintFirst?: 'fill' | 'stroke';

  @IsString()
  @IsOptional()
  globalCompositeOperation?: string;

  @IsNumber()
  @IsOptional()
  skewX?: number;

  @IsNumber()
  @IsOptional()
  skewY?: number;

  @IsArray()
  @IsOptional()
  path?: SlideObjectPath[];

  @IsNumber()
  @IsOptional()
  x1?: number;

  @IsNumber()
  @IsOptional()
  x2?: number;

  @IsNumber()
  @IsOptional()
  y1?: number;

  @IsNumber()
  @IsOptional()
  y2?: number;

  @IsNumber()
  @IsOptional()
  rx?: number;

  @IsNumber()
  @IsOptional()
  ry?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  radius?: number;

  @IsNumber()
  @IsOptional()
  startAngle?: number;

  @IsNumber()
  @IsOptional()
  endAngle?: number;

  @IsString()
  @IsOptional()
  fontFamily?: string;

  @IsString()
  @IsOptional()
  fontWeight?: string;

  @IsNumber()
  @IsOptional()
  fontSize?: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsBoolean()
  @IsOptional()
  underline?: boolean;

  @IsBoolean()
  @IsOptional()
  overline?: boolean;

  @IsBoolean()
  @IsOptional()
  linethrough?: boolean;

  @IsIn(['left', 'center', 'right'])
  @IsOptional()
  textAlign?: 'left' | 'center' | 'right';

  @IsIn(['normal', 'italic'])
  @IsOptional()
  fontStyle?: 'normal' | 'italic';

  @IsNumber()
  @IsOptional()
  lineHeight?: number;

  @IsString()
  @IsOptional()
  textBackgroundColor?: string;

  @IsNumber()
  @IsOptional()
  charSpacing?: number;

  @IsArray()
  @IsOptional()
  styles?: SlideObjectTextStyles[];

  @IsIn(['ltr', 'rtl'])
  @IsOptional()
  direction?: 'ltr' | 'rtl';

  @IsNumber()
  @IsOptional()
  pathStartOffset?: number;

  @IsIn(['left', 'right', 'center'])
  @IsOptional()
  pathSide?: 'left' | 'right' | 'center';

  @IsIn(['baseline', 'middle', 'top', 'bottom'])
  @IsOptional()
  pathAlign?: 'baseline' | 'middle' | 'top' | 'bottom';

  @IsString()
  @IsOptional()
  src?: string;

  @IsIn(['null', 'anonymous'])
  @IsOptional()
  crossOrigin?: 'null' | 'anonymous';

  @IsNumber()
  @IsOptional()
  cropX?: number;

  @IsNumber()
  @IsOptional()
  cropY?: number;

  @IsArray()
  @IsOptional()
  filters?: SlideObjectFilter[];
}
