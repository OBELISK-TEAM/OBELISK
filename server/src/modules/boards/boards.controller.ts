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
import { BoardsOwnerShipFilterOption as GetBoardsOwnershipFilter } from 'src/enums/boards.ownership.filter.option';
import { UserRelatedBoardsPaginatedResponseObject } from 'src/shared/interfaces/response-objects/UserRelatedBoardsPaginatedResponseObject';

// TODO - verify permissions for endpointss

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserRelatedBoards(
    @User('_id') userId: string,
    @Query('activeTab') boardsOwnershipFilterOption: GetBoardsOwnershipFilter,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<UserRelatedBoardsPaginatedResponseObject> {
    return this.boardsService.getUserRelatedBoards(
      userId,
      boardsOwnershipFilterOption,
      page,
      limit,
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
