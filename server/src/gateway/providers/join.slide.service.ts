import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { JoinSlideData } from '../gateway.dto';
import { SlidesService } from '../../modules/slides/slides.service';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';

@Injectable()
export class JoinSlideService {
  constructor(private readonly slidesService: SlidesService) {}
  private readonly logger = new Logger(JoinSlideService.name);

  async handleJoinSlide(
    client: GwSocketWithTarget,
    data: JoinSlideData,
  ): Promise<SlideResponseObject> {
    // use try-catch block to catch errors especially for get slide!!

    const newSlideNumber = data.slide.slideNumber;
    const boardId = client.data.user.targetBoard.boardId;
    const newSlide = await this.slidesService.getSlide(boardId, newSlideNumber);

    await this.leaveCurrentSlide(client);
    await this.joinNewSlide(client, newSlide._id, newSlideNumber);

    client.data.user.targetSlide = {
      slideNumber: newSlideNumber,
      slideId: newSlide._id,
    };

    return newSlide;
  }

  async joinNewSlide(
    client: GwSocketWithTarget,
    slideId: string,
    slideNumber: number,
  ): Promise<void> {
    // if (client.data.user.targetSlide.slideId === slideId) return;
    this.logger.log(`Joining the ${slideNumber} slide with id ${slideId}...`);
    await client.join(slideId);
    client.to(slideId).emit('joined-slide', {
      message: `${client.data.user.email} has joined the slide`,
    });
  }

  async leaveCurrentSlide(client: GwSocketWithTarget): Promise<void> {
    const slideId = client.data.user.targetSlide.slideId;
    if (!slideId) return;
    this.logger.log(`${client.data.user.email} is leaving the slide...`);
    await client.leave(slideId);
    client.to(slideId).emit('left-slide', {
      message: `${client.data.user.email} has left the slide`,
    });
  }
}
