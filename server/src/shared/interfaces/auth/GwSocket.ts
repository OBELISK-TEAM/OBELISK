import { Socket } from 'socket.io';
import { SafeUserDoc } from './SafeUserDoc';
import { AvailableBoards } from '../AvailableBoards';
import { BoardPermission } from '../../../enums/board.permission';

type TargetBoard = {
  boardId: string;
  permission: BoardPermission;
};

interface UserWithBoards extends SafeUserDoc {
  availableBoards?: AvailableBoards;
  targetBoard?: TargetBoard;
}

export interface GwSocket extends Socket {
  data: {
    user: UserWithBoards;
  };
}

export interface GwSocketWithTarget extends Socket {
  data: {
    user: UserWithBoards & { targetBoard: TargetBoard };
  };
}
