// queue/queue.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class QueueService {
  constructor(@Inject('MAILING_CLIENT') private readonly client: ClientProxy) {}

  async enqueueMessage() {
    console.log('i am trying so hard');
    return this.publishToQueue('send-message', {
      message: 'hello world',
    });
  }

  private publishToQueue(pattern: string, data: any): void {
    this.client.emit(pattern, data);
  }
}
