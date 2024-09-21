import { Socket } from 'socket.io';
import { SafeUserDoc } from './SafeUserDoc';
import { AvailableBoards } from '../AvailableBoards';
import { BoardPermission } from '../../../enums/board.permission';

export interface GwSocket extends Socket {
  data: {
    user: SafeUserDoc & {
      availableBoards?: AvailableBoards;
      targetBoard?: {
        boardId: string;
        permission: BoardPermission;
      };
    };
  };
}
