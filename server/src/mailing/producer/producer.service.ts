import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProducerMsg } from '../../shared/interfaces/mailing/Message';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);
  // private readonly serverUrl: string;

  constructor(
    @Inject('MAILING_CLIENT')
    private readonly client: ClientProxy,
    // private readonly configService: ConfigService,
  ) {
    // this.serverUrl = this.getServerUrl();
  }

  sendWelcomeEmail(recipient: string): void {
    this.logger.log(`Enqueueing welcome email to ${recipient}`);
    this.publishToQueue('welcome-email', { recipient });
  }

  private publishToQueue(pattern: string, data: BaseProducerMsg): void {
    this.client.emit(pattern, data);
  }

  // private getServerUrl(): string {
  //   const host = this.configService.get('SERVER_HOST', DEFAULT_SERVER_HOST);
  //   const port = this.configService.get('SERVER_PORT', DEFAULT_SERVER_PORT);
  //   return `${host}:${port}`;
  // }
}
