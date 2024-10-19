import {
  IsDefined,
  ValidateNested,
  IsObject,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SlideData {
  @IsDefined()
  @IsNumber()
  slideNumber: number;
}

export class JoinSlideData {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SlideData)
  slide: SlideData;
}

export class AddSlideData extends JoinSlideData {}
export class DeleteSlideData extends JoinSlideData {}
