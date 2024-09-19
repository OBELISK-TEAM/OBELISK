import { IsNotEmpty, IsString } from 'class-validator';

export class JoinBoardDto {
  @IsString({
    message: 'The boardId must be a string',
  })
  @IsNotEmpty({
    message: 'The boardId is required',
  })
  boardId: string;
}
