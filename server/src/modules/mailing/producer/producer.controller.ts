import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller('test')
export class ProducerController {
  constructor(private readonly queueService: ProducerService) {}

  // just a test endpoint to send a message to the queue

  @Get()
  sendMessage() {
    this.queueService.sendWelcomeEmail('psyduck281@gmail.com');
    return { status: 'Message sent' };
  }
}
