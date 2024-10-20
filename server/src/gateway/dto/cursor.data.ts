// src/gateway/dto/cursor.data.ts

import {
  IsDefined,
  IsNotEmpty,
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

  @IsDefined()
  @IsString()
  username: string;
}

export class CursorRemoveData {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
