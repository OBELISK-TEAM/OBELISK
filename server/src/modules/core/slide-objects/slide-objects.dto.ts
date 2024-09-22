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
import { SlideObjectShadow } from '../../../shared/interfaces/fabric-js/SlideObjectShadow';
import { SlideObjectPath } from '../../../shared/interfaces/fabric-js/SlideObjectPath';
import { SlideObjectFilter } from '../../../shared/interfaces/fabric-js/SlideObjectFilter';
import { SlideObjectTextStyles } from '../../../shared/interfaces/fabric-js/SlideObjectTextStyles';

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
