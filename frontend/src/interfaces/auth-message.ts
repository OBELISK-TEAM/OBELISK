import { AuthMessageType } from "@/enums/AuthMessage";

export interface AuthMessage {
  type: AuthMessageType;
  message: string;
}
