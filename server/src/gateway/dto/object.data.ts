import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectProps } from '../../modules/objects/objects.dto';

export class OnlyId {
  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class ObjectPropsWithId extends ObjectProps {
  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class AddObjectData {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectProps)
  object: ObjectProps;
}

export class UpdateObjectData {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectPropsWithId)
  object: ObjectPropsWithId;
}

export class DeleteObjectData {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => OnlyId)
  object: OnlyId;
}
