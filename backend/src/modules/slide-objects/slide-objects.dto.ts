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
import { SlideObjectShadow } from '../../shared/interfaces/SlideObjectShadow';
import { SlideObjectPath } from '../../shared/interfaces/SlideObjectPath';
import { SlideObjectFilter } from '../../shared/interfaces/SlideObjectFilter';
import { SlideObjectTextStyles } from '../../shared/interfaces/SlideObjectTextStyles';

export class CreateSlideObjectDto {
  @IsString({
    message: 'The slideId must be a string',
  })
  @IsNotEmpty({
    message: 'The slideId is required',
  })
  slideId: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  originX: string;

  @IsOptional()
  @IsString()
  originY: string;

  @IsOptional()
  @IsNumber()
  left: number;

  @IsOptional()
  @IsNumber()
  top: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  width: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  strokeWidth: number;

  @IsOptional()
  @IsIn(['butt', 'round', 'square'])
  strokeLineCap: 'butt' | 'round' | 'square';

  @IsOptional()
  @IsNumber()
  strokeDashOffset: number;

  @IsOptional()
  @IsIn(['miter', 'round', 'bevel'])
  strokeLineJoin: 'miter' | 'round' | 'bevel';

  @IsOptional()
  @IsBoolean()
  strokeUniform: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  strokeMiterLimit: number;

  @IsOptional()
  @IsNumber()
  scaleX: number;

  @IsOptional()
  @IsNumber()
  scaleY: number;

  @IsOptional()
  @IsNumber()
  angle: number;

  @IsOptional()
  @IsBoolean()
  flipX: boolean;

  @IsOptional()
  @IsBoolean()
  flipY: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  opacity: number;

  @IsOptional()
  @IsBoolean()
  visible: boolean;

  @IsOptional()
  @IsString()
  fillRule: string;

  @IsOptional()
  @IsIn(['fill', 'stroke'])
  paintFirst: 'fill' | 'stroke';

  @IsOptional()
  @IsString()
  globalCompositeOperation: string;

  @IsOptional()
  @IsNumber()
  skewX: number;

  @IsOptional()
  @IsNumber()
  skewY: number;

  @IsOptional()
  @IsArray()
  path: SlideObjectPath;

  @IsOptional()
  @Type(() => SlideObjectShadow)
  shadow: SlideObjectShadow | null;

  @IsOptional()
  @IsArray()
  strokeDashArray: number[] | null;

  @IsOptional()
  @IsString()
  stroke: string | null;

  @IsOptional()
  @IsString()
  fill: string | null;

  @IsOptional()
  @IsString()
  backgroundColor: string;

  @IsOptional()
  @IsNumber()
  x1: number;

  @IsOptional()
  @IsNumber()
  x2: number;

  @IsOptional()
  @IsNumber()
  y1: number;

  @IsOptional()
  @IsNumber()
  y2: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  radius: number;

  @IsOptional()
  @IsNumber()
  startAngle: number;

  @IsOptional()
  @IsNumber()
  endAngle: number;

  @IsOptional()
  @IsString()
  fontFamily: string;

  @IsOptional()
  @IsString()
  fontWeight: string;

  @IsOptional()
  @IsNumber()
  fontSize: number;

  @IsOptional()
  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  underline: boolean;

  @IsOptional()
  @IsBoolean()
  overline: boolean;

  @IsOptional()
  @IsBoolean()
  linethrough: boolean;

  @IsOptional()
  @IsIn(['left', 'center', 'right'])
  textAlign: 'left' | 'center' | 'right';

  @IsOptional()
  @IsIn(['normal', 'italic'])
  fontStyle: 'normal' | 'italic';

  @IsOptional()
  @IsNumber()
  lineHeight: number;

  @IsOptional()
  @IsString()
  textBackgroundColor: string;

  @IsOptional()
  @IsNumber()
  charSpacing: number;

  @IsOptional()
  @IsArray()
  styles: SlideObjectTextStyles[];

  @IsOptional()
  @IsIn(['ltr', 'rtl'])
  direction: 'ltr' | 'rtl';

  @IsOptional()
  @IsNumber()
  pathStartOffset: number;

  @IsOptional()
  @IsIn(['left', 'right', 'center'])
  pathSide: 'left' | 'right' | 'center';

  @IsOptional()
  @IsIn(['baseline', 'middle', 'top', 'bottom'])
  pathAlign: 'baseline' | 'middle' | 'top' | 'bottom';

  @IsOptional()
  @IsString()
  src: string;

  @IsOptional()
  @IsIn(['null', 'anonymous'])
  crossOrigin: 'null' | 'anonymous';

  @IsOptional()
  @IsNumber()
  cropX: number;

  @IsOptional()
  @IsNumber()
  cropY: number;

  @IsOptional()
  @IsArray()
  filters: SlideObjectFilter[];
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
