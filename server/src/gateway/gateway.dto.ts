import { IsNotEmpty, IsString } from 'class-validator';
import {
  CustomSlideObject,
  CustomSlideObjectWithId,
} from '../shared/interfaces/CustomSlideObject';

export class JoinBoardDto {
  @IsString({
    message: 'The boardId must be a string',
  })
  @IsNotEmpty({
    message: 'The boardId is required',
  })
  boardId: string;
}

export interface AddObjectData {
  object: CustomSlideObject;
}

export interface UpdateObjectData {
  object: CustomSlideObjectWithId;
}
