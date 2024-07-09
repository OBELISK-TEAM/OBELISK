import { IsNotEmpty, IsString } from 'class-validator';
import { SlideObject } from '../../schemas/slide.schema';

export class CreateSlideDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  objects: SlideObject[];
}
