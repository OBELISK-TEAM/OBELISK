import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { BoardsFilter } from '../../enums/boardsFilter';
import { SortOrder } from './boards.service';

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

export class BoardQueryDto {
  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  limit: number;

  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: SortOrder;

  @IsIn([BoardsFilter.OWNED_BY, BoardsFilter.SHARED_FOR, BoardsFilter.ALL])
  @IsOptional()
  tab: BoardsFilter;
}
