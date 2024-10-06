import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './boards.dto';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { BoardsFilter } from 'src/enums/boardsFilter';

// TODO - verify permissions for endpointss

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserRelatedBoards(
    // better to use @Query() { page, limit, order, tab }: QueryDto
    // instead of multiple @Query
    @User('_id') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('tab') filter: BoardsFilter,
  ): Promise<any> {
    return this.boardsService.getUserRelatedBoards(
      userId,
      page,
      limit,
      order,
      filter,
    );
  }

  // TODO - check permissions to fetch board
  @Get(':boardId')
  getBoard(@Param('boardId') boardId: string): Promise<BoardResponseObject> {
    return this.boardsService.getBoardById(boardId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createBoard(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardResponseObject> {
    return this.boardsService.createBoard(userId, createBoardDto);
  }

  // TODO - check permissions to delete board
  @Delete(':boardId')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(
    @User('_id') userId: string,
    @Param('boardId') boardId: string,
  ): Promise<BoardResponseObject> {
    return this.boardsService.deleteBoard(userId, boardId);
  }

  // @Put(':boardId/permissions')
  // @UseGuards(JwtAuthGuard)
  // async updatePermissions(
  //   @User('_id') userId: string,
  //   @Param('boardId') boardId: string,
  //   @Body() permissions: BoardPermissions,
  // ): Promise<any> {
  //   return this.boardsService.updatePermissions(userId, boardId, permissions);
  // }
}
