import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { BoardsService } from './boards/boards.service';
import { SlidesService } from './slides/slides.service';
import { CreateSlideObjectDto } from './slide-objects/slide-objects.dto';
import { SlideObjectResponseObject } from 'src/shared/interfaces/response-objects/SlideObjectResponseObject';
import { BoardPermission } from 'src/enums/board.permission';
import { SlideObjectsService } from './slide-objects/slide-objects.service';

@Injectable()
export class CoreService {
  constructor(
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService,
    private readonly slidesService: SlidesService,
    private readonly slideObjectsService: SlideObjectsService,
  ) {}

  async createSlideObject(
    userId: string,
    createSlideObjectDto: CreateSlideObjectDto,
  ): Promise<SlideObjectResponseObject> {
    const { slideId, ...slideObject } = createSlideObjectDto;
    const slide = await this.slidesService.findSlideById(slideId);
    const user = await this.usersService.findUserById(userId);
    const board = await this.boardsService.findBoardById(slide.board);
    this.boardsService.verifyBoardPermission(
      board,
      user,
      BoardPermission.EDITOR,
    );
    const createdSlideObject =
      new (this.slideObjectsService.getSlideObjectModel())({
        ...slideObject,
        createdBy: user,
        slide,
      });
    await this.usersService.addSlideObjectToUser(userId, createdSlideObject);
    await this.slidesService.addSlideObjectToSlide(slideId, createdSlideObject);
    return createdSlideObject
      .save()
      .then(slideObject =>
        this.slideObjectsService.toResponseSlideObject(slideObject),
      );
  }
}
