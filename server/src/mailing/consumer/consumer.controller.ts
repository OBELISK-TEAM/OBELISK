import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import {
  BaseConsumerMsg,
  WelcomeEmailMsg,
} from '../../shared/interfaces/mailing/Message';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('welcome-email')
  async sendMessage(@Ctx() context: RmqContext) {
    const content = this.parseMessage(context) as WelcomeEmailMsg;
    await this.consumerService.sendWelcomeEmail(content);
  }

  private parseMessage(ctx: RmqContext): BaseConsumerMsg {
    const message = ctx.getMessage();

    if (!message || !message.content || !(message.content instanceof Buffer))
      throw new HttpException('Invalid message', HttpStatus.BAD_REQUEST);

    const buffer: Buffer = message.content;
    const content = JSON.parse(buffer.toString());

    if (!content || typeof content !== 'object')
      throw new HttpException('Invalid message', HttpStatus.BAD_REQUEST);

    return content as BaseConsumerMsg;
  }
}
