import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';

// test

@Module({
  imports: [ProducerModule, ConsumerModule],
})
export class MailingModule {}
