import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './boards.dto';
import { BoardDocument } from '../../schemas/board.schema';
import { User } from '../auth/decorators/users.decorator';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async findAll(@Query('page') page: number): Promise<BoardDocument[]> {
    return this.boardsService.findAll(page);
  }

  @Post()
  create(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    return this.boardsService.create(userId, createBoardDto);
  }

  @Get(':id')
  async findOne(@Param('id') boardId: string): Promise<BoardDocument> {
    return this.boardsService.findOneById(boardId);
  }

  @Put(':id')
  Update(
    @Param('id') boardId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    return this.boardsService.update(boardId, createBoardDto);
  }

  @Delete(':id')
  async delete(@Param('id') boardId: string): Promise<BoardDocument> {
    return this.boardsService.delete(boardId);
  }
}
