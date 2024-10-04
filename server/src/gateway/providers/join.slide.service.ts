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
    await this.joinNewSlide(client, newSlide._id.toString());

    client.data.user.targetSlide = {
      slideNumber: newSlideNumber,
      slideId: newSlide._id.toString(),
    };

    return newSlide;
  }

  async joinNewSlide(
    client: GwSocketWithTarget,
    slideId: string,
  ): Promise<void> {
    const user = client.data.user;
    await client.join(slideId);
    client.to(slideId).emit('joined-slide', {
      message: `${user.email} has joined the slide`,
    });
    this.logger.log(`${user.email} has joined the slide ${slideId}`);
  }

  async leaveCurrentSlide(client: GwSocketWithTarget): Promise<void> {
    const user = client.data.user;
    const slideId = user.targetSlide.slideId;
    if (!slideId) return;
    await client.leave(slideId);
    client.to(slideId).emit('left-slide', {
      message: `${user.email} has left the slide`,
    });
    this.logger.log(`${user.email} has left the slide ${slideId}`);
  }

  async handleLeaveSlide(client: GwSocketWithTarget): Promise<void> {
    await this.leaveCurrentSlide(client);
  }
}
