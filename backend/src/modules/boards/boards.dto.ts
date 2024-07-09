import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  name: string;
}
