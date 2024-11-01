interface BaseMsg {
  recipient: string;
}

export interface BaseConsumerMsg extends BaseMsg {
  pattern: string;
  data: BaseMsg;
}

export interface BaseProducerMsg extends BaseMsg {}

export interface WelcomeEmailMsg extends BaseConsumerMsg {}
