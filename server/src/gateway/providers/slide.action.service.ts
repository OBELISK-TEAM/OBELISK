import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { SlidesService } from '../../modules/slides/slides.service';
import { AddSlideData, DeleteSlideData } from '../gateway.dto';

@Injectable()
export class SlideActionService {
  constructor(private readonly slidesService: SlidesService) {}
  private readonly logger = new Logger(SlideActionService.name);

  async handleAddSlide(
    client: GwSocketWithTarget,
    data: AddSlideData,
  ): Promise<void> {
    const boardId = client.data.user.targetBoard.boardId;
    const slideNumber = data.slide ? data.slide.slideNumber : 1;
    const slide = await this.slidesService.createSlide(boardId, slideNumber);
    this.logger.log(`Slide added: ${slide._id} by ${client.data.user.email}`);
    client.to(boardId).emit('slide-added', { ...slide, slideNumber });
  }

  async handleDeleteSlide(
    client: GwSocketWithTarget,
    data: DeleteSlideData,
  ): Promise<void> {
    const boardId = client.data.user.targetBoard.boardId;
    const slideNumber = data.slide ? data.slide.slideNumber : 1;
    const slide = await this.slidesService.deleteSlide(boardId, slideNumber);
    this.logger.log(`Slide deleted: ${slide._id} by ${client.data.user.email}`);
    client.to(boardId).emit('slide-deleted', { ...slide, slideNumber });
  }
}
