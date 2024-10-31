import { Module } from '@nestjs/common';
import { QueueModule } from './producer/queue.module';
import { ProcessModule } from './consumer/process.module';

@Module({
  imports: [QueueModule, ProcessModule],
})
export class MailingModule {}
