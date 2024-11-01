import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ProducerController } from './producer.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRabbitConfig } from '../../config/rabbit.config';

@Module({
  imports: [ConfigModule],
  controllers: [ProducerController],
  providers: [
    ProducerService,
    {
      provide: 'MAILING_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailingConfig = getRabbitConfig(configService);
        return ClientProxyFactory.create(mailingConfig);
      },
    },
  ],
  exports: [ProducerService],
})
export class ProducerModule {}
