import { Controller } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { EventPattern } from '@nestjs/microservices';
import { WelcomeEmailMessage } from '../../shared/interfaces/mailing/Message';
import { Message } from '../../shared/decorators/message.decorator';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('welcome-email')
  async sendMessage(@Message() data: WelcomeEmailMessage) {
    return this.consumerService.sendWelcomeEmail(data);
  }

  // @EventPattern('welcome-email')
  // async sendMessage(@Ctx() context: RmqContext) {
  //   const content = this.parseMessage(context) as WelcomeEmailMsg;
  //   await this.consumerService.sendWelcomeEmail(content);
  // }
}
