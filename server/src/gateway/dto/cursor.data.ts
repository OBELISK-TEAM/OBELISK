import {
  IsDefined,
  IsNumber,
  IsString,
} from 'class-validator';

export class CursorMoveData {
  @IsDefined()
  @IsNumber()
  x: number;

  @IsDefined()
  @IsNumber()
  y: number;

  @IsDefined()
  @IsString()
  color: string;

}

