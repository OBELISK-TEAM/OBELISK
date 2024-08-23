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
import { BoardDocument } from '../../schemas/board.schema';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  async findAll(@Query('page') page: number): Promise<BoardDocument[]> {
    return this.boardsService.findAll(page);
  }

  @Get(':id')
  async findOne(@Param('id') boardId: string): Promise<BoardDocument> {
    return this.boardsService.findOneById(boardId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    return this.boardsService.create(userId, createBoardDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  Update(
    @User('_id') userId: string,
    @Param('id') boardId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardDocument> {
    return this.boardsService.update(userId, boardId, createBoardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @User('_id') userId: string,
    @Param('id') boardId: string,
  ): Promise<BoardDocument> {
    return this.boardsService.delete(userId, boardId);
  }
}
