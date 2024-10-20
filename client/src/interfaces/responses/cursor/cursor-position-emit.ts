import { BasicUserInfo } from "@/interfaces/socket/SocketCallbacksData";

export interface CursorPosition {
  user: BasicUserInfo;
  cursorData: {
    x: number;
    y: number;
    color: string;
  };
}
