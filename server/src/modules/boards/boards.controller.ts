import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './boards.dto';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';

// TODO - verify permissions for endpoints

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  // TODO - implement
  @Get()
  @UseGuards(JwtAuthGuard)
  getUserBoards(@User('_id') userId: string): string {
    return `User ${userId} boards IMPLEMENT ME`;
    // return this.boardsService.getUserBoards(userId);
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

  // // TODO - check permissions to delete board
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
