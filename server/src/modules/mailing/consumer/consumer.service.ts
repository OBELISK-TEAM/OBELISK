import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { getMailingConfig } from '../../../config/mailing.config';
import { WelcomeEmailMessage } from '../../../shared/interfaces/mailing/Message';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger(ConsumerService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly welcomeTemplate: handlebars.TemplateDelegate;

  constructor(private readonly configService: ConfigService) {
    const mailingOptions = getMailingConfig(configService);
    this.transporter = nodemailer.createTransport(mailingOptions);
    this.welcomeTemplate = this.loadTemplate('welcome.hbs');
  }

  private loadTemplate(templateName: string): handlebars.TemplateDelegate {
    const templatesFolderPath = path.join(__dirname, '..', 'templates');
    const templatePath = path.join(templatesFolderPath, templateName);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return handlebars.compile(templateSource);
  }

  async sendWelcomeEmail(message: WelcomeEmailMessage): Promise<void> {
    const { recipient } = message;
    const html = this.welcomeTemplate({ recipient });
    await this.transporter.sendMail({
      to: recipient,
      subject: 'Welcome to Our Service!',
      html,
    });
    this.logger.log(`Welcome email sent to ${recipient}`);
  }
}
