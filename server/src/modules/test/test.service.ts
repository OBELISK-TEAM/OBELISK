import { Inject, Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class TestService {
  // constructor(
  //   @Inject('MAILING_CLIENT')
  //   private readonly client: ClientProxy,
  // ) {}

  // sendEmail(recipient: string, message: string) {
  //   return this.client.send(
  //     {
  //       cmd: 'sendEmail',
  //     },
  //     { recipient, message },
  //   );
  // }

  // sendEmail() {
  //   const hello = 'hello';
  //   const message = 'message';
  //   console.log('client is sending email');
  //   return this.client.send(
  //     {
  //       cmd: 'sendEmail',
  //     },
  //     { hello, message },
  //   );
  // }

  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'mailing_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendMessage() {
    return this.client.send('sendEmail', { message: 'hello' });
  }
}
