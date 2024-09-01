import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { IBoardResponseObject, BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import { ApiResponse } from '@nestjs/swagger';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'returns a paginated list of all boards',
    type: Array<BoardResponseObject>,
  })
  async getBoards(
    @Query('page') page: number = 1,
  ): Promise<IBoardResponseObject[]> {
    return this.boardsService.getBoards(page);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'returns board with the given ID',
    type: BoardResponseObject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'board with the given ID not found',
  })
  async getBoardById(
    @Param('id') boardId: string,
  ): Promise<IBoardResponseObject> {
    return this.boardsService.getBoardById(boardId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'creates new board',
    type: BoardResponseObject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'user (owner) does not exist',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized',
  })
  createBoard(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<IBoardResponseObject> {
    return this.boardsService.createBoard(userId, createBoardDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'updates board with the given ID',
    type: BoardResponseObject,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'a user without ownership of the board attempted to update it',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'board not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized',
  })
  updateBoard(
    @User('_id') userId: string,
    @Param('id') boardId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<IBoardResponseObject> {
    return this.boardsService.updateBoard(userId, boardId, createBoardDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'updates board with the given ID',
    type: BoardResponseObject,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'a user without ownership of the board attempted to delete it',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'board not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized',
  })
  async deleteBoard(
    @User('_id') userId: string,
    @Param('id') boardId: string,
  ): Promise<IBoardResponseObject> {
    return this.boardsService.deleteBoard(userId, boardId);
  }
}
