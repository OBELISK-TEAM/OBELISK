import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OnlyId {
  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class JoinBoardData {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => OnlyId)
  board: OnlyId;
}
