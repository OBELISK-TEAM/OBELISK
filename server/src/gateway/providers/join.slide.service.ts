import { Injectable, Logger } from '@nestjs/common';
import { GwSocketWithTarget } from '../../shared/interfaces/auth/GwSocket';
import { JoinSlideData } from '../dto/slide.data';
import { SlidesService } from '../../modules/slides/slides.service';
import { SlideResponseObject } from '../../shared/interfaces/response-objects/SlideResponseObject';
import { CommonService } from './common.service';

@Injectable()
export class JoinSlideService {
  constructor(
    private readonly slidesService: SlidesService,
    private readonly commonService: CommonService,
  ) {}
  private readonly logger = new Logger(JoinSlideService.name);

  async handleJoinSlide(
    client: GwSocketWithTarget,
    data: JoinSlideData,
  ): Promise<SlideResponseObject> {
    let newSlideNumber;
    if (!data.slide) {
      newSlideNumber = 1;
    } else {
      newSlideNumber = data.slide.slideNumber;
    }
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
      email: user.email,
      _id: user._id,
    });
    this.logger.log(`${user.email} has joined the slide ${slideId}`);
  }

  async leaveCurrentSlide(client: GwSocketWithTarget): Promise<void> {
    return this.commonService.leaveTarget(client, 'slide');
  }
}
