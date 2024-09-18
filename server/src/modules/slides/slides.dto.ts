import { IsNotEmpty, IsString } from 'class-validator';
import { SlideObject } from '../../schemas/slide-object.schema';

export class CreateSlideDto {
  @IsString({
    message: 'The version must be a string',
  })
  @IsNotEmpty({
    message: 'The version is required',
  })
  version: string;

  @IsString({
    message: 'The boardId must be a string',
  })
  @IsNotEmpty({
    message: 'The boardId is required',
  })
  boardId: string;

  objects: SlideObject[];
}