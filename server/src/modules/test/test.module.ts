import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  //   imports: [
  //     ClientsModule.register([
  //       {
  //         name: 'MAILING_CLIENT',
  //         transport: Transport.RMQ,
  //         options: {
  //           urls: ['amqp://localhost:5672'],
  //           queue: 'mailing_queue',
  //           queueOptions: {
  //             durable: false,
  //           },
  //         },
  //       },
  //     ]),
  // ],
  providers: [
    TestService,
    // {
    //   provide: 'MAILING_CLIENT',
    //   useFactory: () => {
    //     return ClientProxyFactory.create({
    //       transport: Transport.RMQ,
    //       options: {
    //         urls: ['amqp://localhost:5672'],
    //         queue: 'mailing-queue',
    //         queueOptions: {
    //           durable: false,
    //         },
    //       },
    //     });
    //   },
    // },
  ],
  controllers: [TestController],
})
export class TestModule {}
