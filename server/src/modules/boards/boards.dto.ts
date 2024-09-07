import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBoardDto {
  @IsString({
    message: 'The name must be a string',
  })
  @IsNotEmpty({
    message: 'The name is required',
  })
  @Length(3, 30, {
    message: 'The name must be at least 3 but not longer than 30 characters',
  })
  name: string;
}

export class UpdateBoardDto {
  @IsString({
    message: 'The name must be a string',
  })
  @IsNotEmpty({
    message: 'The name is required',
  })
  @Length(3, 30, {
    message: 'The name must be at least 3 but not longer than 30 characters',
  })
  name: string;
}
