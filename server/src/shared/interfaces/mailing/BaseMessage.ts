export interface BaseMessage {
  pattern: string;
  data: {
    recipient: string;
  };
}
