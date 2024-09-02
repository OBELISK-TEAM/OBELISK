import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './boards.dto';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async getBoards(@Query('page') page: number): Promise<BoardResponseObject[]> {
    return this.boardsService.getBoards(page);
  }

  @Get(':id')
  async getBoardById(
    @Param('id') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<BoardResponseObject> {
    return this.boardsService.getBoardById(boardId, slideNumber);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createBoard(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    return this.boardsService.createBoard(userId, createBoardDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateBoard(
    @User('_id') userId: string,
    @Param('id') boardId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    return this.boardsService.updateBoard(userId, boardId, createBoardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(
    @User('_id') userId: string,
    @Param('id') boardId: string,
  ): Promise<BoardResponseObject> {
    return this.boardsService.deleteBoard(userId, boardId);
  }
}
