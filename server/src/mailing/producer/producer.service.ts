import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_SERVER_HOST,
  DEFAULT_SERVER_PORT,
} from '../../config/dev.config';

@Injectable()
export class ProducerService {
  private readonly logger = new Logger(ProducerService.name);
  private readonly serverUrl: string;

  constructor(
    @Inject('MAILING_CLIENT')
    private readonly client: ClientProxy,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    this.serverUrl = this.getServerUrl();
  }

  sendWelcomeEmail(recipient: string): void {
    this.logger.log(`Enqueueing welcome email to ${recipient}`);
    this.publishToQueue('welcome-email', { recipient });
  }

  async sendActivationEmail(recipient: string): Promise<void> {
    this.logger.log(`Enqueueing activation email to ${recipient}`);
    await this.generateActivationCode(recipient);
  }

  private publishToQueue(pattern: string, data: MessageData): void {
    this.client.emit(pattern, data);
  }

  private async generateActivationCode(recipient: string): Promise<string> {
    const verificationKey = crypto.randomUUID();
    const expirationTime = 10 * 60 * 1000; // 10 minutes
    await this.cacheManager.set(verificationKey, recipient, expirationTime);
    return `http:${this.serverUrl}/auth/activate/${verificationKey}`;
  }
  //
  // async generatePasswordResetCode(recipient: string): Promise<string> {
  //   const code = Math.floor(Math.random() * 899999 + 100000) + ''; // 6 digit code
  //   const expirationTime = 10 * 60 * 1000; // 10 minutes
  //
  //   await this.cacheManager.set(
  //     `temp-usr-password-key-${recipient}`,
  //     code,
  //     expirationTime,
  //   );
  //
  //   return code;
  // }

  private getServerUrl(): string {
    const host = this.configService.get('SERVER_HOST', DEFAULT_SERVER_HOST);
    const port = this.configService.get('SERVER_PORT', DEFAULT_SERVER_PORT);
    return `${host}:${port}`;
  }
}

export interface MessageData {
  recipient: string;
}
