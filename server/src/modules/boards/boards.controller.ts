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
import { BoardQueryDto, CreateBoardDto } from './boards.dto';
import { User } from '../auth/decorators/users.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { BoardResponseObject } from '../../shared/interfaces/response-objects/BoardResponseObject';
import {
  PaginatedBoardsResponseObject,
  PopulatedBoardResponseObject,
} from '../../shared/interfaces/response-objects/PaginatedUserBoards';
import { BoardAccessGuard } from '../auth/guards/board.access.guard';
import { MinimumBoardPermission } from '../auth/decorators/permissions.decorator';
import { BoardPermission } from '../../shared/enums/board.permission';

// TODO - verify permissions for endpointss

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserRelatedBoards(
    @User('_id') userId: string,
    @Query() { page, limit, order, tab }: BoardQueryDto,
  ): Promise<PaginatedBoardsResponseObject> {
    return this.boardsService.getUserRelatedBoards(
      userId,
      page,
      limit,
      order,
      tab,
    );
  }

  // TODO - check permissions to fetch board
  @Get(':boardId')
  getBoard(@Param('boardId') boardId: string): Promise<BoardResponseObject> {
    return this.boardsService.getBoardById(boardId);
  }

  @Get(':boardId/details')
  @UseGuards(JwtAuthGuard, BoardAccessGuard)
  @MinimumBoardPermission(BoardPermission.EDITOR)
  getBoardDetails(
    @User('_id') userId: string,
    @Param('boardId') boardId: string,
  ): Promise<PopulatedBoardResponseObject> {
    return this.boardsService.getBoardDetails(userId, boardId);
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
