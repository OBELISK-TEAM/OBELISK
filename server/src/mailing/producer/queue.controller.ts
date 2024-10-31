import { Controller, Get } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('test')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  async sendMessage() {
    await this.queueService.enqueueMessage();
    return { status: 'Message sent' };
  }
}
