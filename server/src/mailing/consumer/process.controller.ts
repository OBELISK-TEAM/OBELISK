import { Controller } from '@nestjs/common';
import { ProcessService } from './process.service';
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @EventPattern('send-message')
  async sendMessage(@Ctx() context: RmqContext) {
    const data = JSON.parse(context.getMessage().content.toString());
    return this.processService.process(data);
  }
}
