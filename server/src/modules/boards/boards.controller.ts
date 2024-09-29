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
import { BoardPermissions } from '../../shared/interfaces/BoardPermissions';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createBoard(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<any> {
    return this.boardsService.createBoard(userId, createBoardDto);
  }

  @Delete(':boardId')
  @UseGuards(JwtAuthGuard)
  async deleteBoard(
    @User('_id') userId: string,
    @Param('boardId') boardId: string,
  ): Promise<any> {
    return this.boardsService.deleteBoard(userId, boardId);
  }

  @Get(':boardId')
  getSlide(
    @Param('boardId') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<any> {
    return this.boardsService.getSlide(boardId, slideNumber);
  }

  @Put(':boardId/permissions')
  @UseGuards(JwtAuthGuard)
  async updatePermissions(
    @User('_id') userId: string,
    @Param('boardId') boardId: string,
    @Body() permissions: BoardPermissions,
  ): Promise<any> {
    return this.boardsService.updatePermissions(userId, boardId, permissions);
  }
}
