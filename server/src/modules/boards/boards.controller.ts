import {
  Body,
  Controller,
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

  // @Get()
  // async getBoards(@Query('page') page: number): Promise<BoardResponseObject[]> {
  //   return this.boardsService.getBoards(page);
  // }
  //
  // @Get(':id')
  // async getBoardById(
  //   @Param('id') boardId: string,
  //   @Query('slide') slideNumber: number,
  // ): Promise<BoardResponseObject> {
  //   return this.boardsService.getBoardById(boardId, slideNumber);
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  createBoard(
    @User('_id') userId: string,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<any> {
    return this.boardsService.createBoard(userId, createBoardDto);
  }

  @Post(':boardId')
  createSlide(@Param('boardId') boardId: string): Promise<any> {
    console.log(boardId);
    return this.boardsService.createSlide(boardId);
  }

  @Post(':boardId/slides/:slideId')
  createObject(
    @Param('boardId') boardId: string,
    @Param('slideId') slideId: string,
    @Body() objectProps: any,
  ): Promise<any> {
    return this.boardsService.createObject(boardId, slideId, objectProps);
  }

  @Get(':boardId')
  getSlide(
    @Param('boardId') boardId: string,
    @Query('slide') slideNumber: number,
  ): Promise<any> {
    return this.boardsService.getSlide(boardId, slideNumber);
  }

  // @Put(':id')
  // @UseGuards(JwtAuthGuard)
  // updateBoard(
  //   @User('_id') userId: string,
  //   @Param('id') boardId: string,
  //   @Body() createBoardDto: CreateBoardDto,
  // ): Promise<BoardResponseObject> {
  //   return this.boardsService.updateBoard(userId, boardId, createBoardDto);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // async deleteBoard(
  //   @User('_id') userId: string,
  //   @Param('id') boardId: string,
  // ): Promise<BoardResponseObject> {
  //   return this.boardsService.deleteBoard(userId, boardId);
  // }

  // // TODO add proper dto!!! with class validator - now its for testing purposes
  @Put(':id/permissions')
  @UseGuards(JwtAuthGuard)
  async updatePermissions(
    @User('_id') userId: string,
    @Param('id') boardId: string,
    @Body() permissions: BoardPermissions,
  ): Promise<any> {
    return this.boardsService.updatePermissions(userId, boardId, permissions);
  }
}
