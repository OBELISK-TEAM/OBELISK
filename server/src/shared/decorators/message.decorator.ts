import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { RabbitBufferContent } from '../interfaces/mailing/Message';

// extract data from the rabbit message,
// use @Message to get the data from the message

export const Message = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const rmqContext = ctx.switchToRpc().getContext<RmqContext>();
    const message = rmqContext.getMessage();

    if (!message || !message.content || !(message.content instanceof Buffer))
      throw new HttpException('Invalid message', HttpStatus.BAD_REQUEST);

    const buffer = message.content;
    const content = JSON.parse(buffer.toString()) as RabbitBufferContent;

    if (!content || typeof content !== 'object' || !content.data)
      throw new HttpException('Invalid message', HttpStatus.BAD_REQUEST);

    return content.data;
  },
);
