import { IsNotEmpty, IsString } from 'class-validator';
import { SlideObject } from '../../schemas/slide.schema';

export class CreateSlideDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  boardId: string;

  objects: SlideObject[];
}

export class UpdateSlideDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  boardId: string;

  objects: SlideObject[];
}
