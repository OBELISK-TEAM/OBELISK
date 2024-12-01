import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../../shared/interfaces/auth/GwSocket';
import { SlidesService } from '../../core/slides/slides.service';
import { AddSlideData, DeleteSlideData } from '../dto/slide.data';
import { ObjectStatsService } from 'src/modules/stats/object/object.stats.service';
import { SlideStatsService } from 'src/modules/stats/slide/slides.stats.service';
import { Types } from 'mongoose';
import { BoardStatsService } from 'src/modules/stats/board/board.stats.service';
import { BoardAction } from 'src/shared/enums/actions/board.action';

@Injectable()
export class SlideActionService {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly objectStatsService: ObjectStatsService,
    private readonly slideStatsService: SlideStatsService,
    private readonly boardStatsService: BoardStatsService,
  ) {}
  private readonly logger = new Logger(SlideActionService.name);

  async handleAddSlide(
    client: GwSocketWithTarget,
    data: AddSlideData,
  ): Promise<void> {
    const boardId = client.data.user.targetBoard.boardId;
    const slideNumber = data.slide ? data.slide.slideNumber : -1;
    const slide = await this.slidesService.createSlide(boardId, slideNumber);
    this.logger.log(`Slide added: ${slide._id} by ${client.data.user.email}`);
    client.to(boardId).emit('slide-added', { ...slide, slideNumber });
    const userId = (client.data.user._id as Types.ObjectId).toString();
    void this.slideStatsService.initStats(
      slide._id.toString(),
      boardId,
      userId,
    );
    void this.boardStatsService.logAction(
      boardId,
      userId,
      slide._id.toString(),
      BoardAction.ADD_SLIDE,
    );
  }

  async handleDeleteSlide(
    client: GwSocketWithTarget,
    data: DeleteSlideData,
  ): Promise<void> {
    const boardId = client.data.user.targetBoard.boardId;
    const slideNumber = data.slide ? data.slide.slideNumber : 1;
    const slide = await this.slidesService.deleteSlide(boardId, slideNumber);
    void this.objectStatsService.removeStats(null, slide._id.toString(), null);
    this.logger.log(`Slide deleted: ${slide._id} by ${client.data.user.email}`);
    client.to(boardId).emit('slide-deleted', { ...slide, slideNumber });
    void this.slideStatsService.removeStats(slide._id.toString(), null);
    void this.boardStatsService.logAction(
      boardId,
      (client.data.user._id as Types.ObjectId).toString(),
      slide._id.toString(),
      BoardAction.REMOVE_SLIDE,
    );
  }
}
