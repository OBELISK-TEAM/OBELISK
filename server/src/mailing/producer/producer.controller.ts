import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('test')
export class ProducerController {
  constructor(private readonly queueService: ProducerService) {}

  @Get()
  async sendMessage() {
    this.queueService.sendWelcomeEmail('psyduck281@gmail.com');
    return { status: 'Message sent' };
  }
}
