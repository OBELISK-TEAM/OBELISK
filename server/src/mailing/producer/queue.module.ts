import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { QueueController } from './queue.controller';

@Module({
  controllers: [QueueController],
  providers: [
    QueueService,
    {
      provide: 'MAILING_CLIENT',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'mailing-queue',
            queueOptions: {
              durable: false,
            },
          },
        });
      },
    },
  ],
  exports: [QueueService],
})
export class QueueModule {}
