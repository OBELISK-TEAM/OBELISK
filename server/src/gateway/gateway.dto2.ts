import {
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsObject,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OnlyId {
  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class BoardOnlyId extends OnlyId {}

export class JoinBoardData {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => BoardOnlyId)
  board: BoardOnlyId;
}
