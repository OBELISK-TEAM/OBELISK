import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ProducerController } from './producer.controller';
import { CacheModule } from '@nestjs/cache-manager';

// creating proxy client for RabbitMQ
// with no need to  direct connection to RabbitMQ

@Module({
  imports: [CacheModule.register()],
  controllers: [ProducerController],
  providers: [
    ProducerService,
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
  exports: [ProducerService],
})
export class ProducerModule {}
