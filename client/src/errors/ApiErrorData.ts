export class ApiErrorData extends Error {
  messages: string[];

  constructor(messages: string[]) {
    super(messages.join(", "));
    this.name = "ApiError";
    this.messages = messages;
  }
}
