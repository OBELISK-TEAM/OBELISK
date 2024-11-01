import { Controller } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @EventPattern('welcome-email')
  async sendMessage(@Ctx() context: RmqContext) {
    const message = JSON.parse(context.getMessage().content.toString());
    await this.consumerService.sendWelcomeEmail(message);
  }
}
