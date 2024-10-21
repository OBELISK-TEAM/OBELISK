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
import {
  BoardPermissionDto,
  BoardQueryDto,
  CreateBoardDto,
} from './boards.dto';
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

  @Delete(':boardId')
  @UseGuards(JwtAuthGuard, BoardAccessGuard)
  @MinimumBoardPermission(BoardPermission.OWNER)
  async deleteBoard(
    @User('_id') userId: string,
    @Param('boardId') boardId: string,
  ): Promise<BoardResponseObject> {
    return this.boardsService.deleteBoard(userId, boardId);
  }

  // permissions

  @Post(':boardId/permissions')
  @UseGuards(JwtAuthGuard, BoardAccessGuard)
  @MinimumBoardPermission(BoardPermission.MODERATOR)
  async createPermissionLink(
    @Param('boardId') boardId: string,
    @Body() permission: BoardPermissionDto,
  ): Promise<string> {
    return this.boardsService.createPermissionLink(boardId, permission);
  }

  @Post('permissions/:niewiemjaktonazwac')
  @UseGuards(JwtAuthGuard)
  async grantPermission(
    @User('_id') userId: string,
    @Param('niewiemjaktonazwac') x: string,
  ): Promise<void> {
    console.log('grantPermission', userId, x);
    return this.boardsService.grantPermission(userId, x);
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
