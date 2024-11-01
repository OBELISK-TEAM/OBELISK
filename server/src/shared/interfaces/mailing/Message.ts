export interface BaseMessage {
  recipient: string;
}

export interface RabbitBufferContent {
  pattern: string;
  data: unknown;
}

export interface WelcomeEmailMessage extends BaseMessage {}
