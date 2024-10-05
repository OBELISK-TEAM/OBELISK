import { Socket } from 'socket.io';
import { SafeUserDoc } from './SafeUserDoc';
import { BoardPermission } from '../../../enums/board.permission';

type TargetBoard = {
  boardId: string;
  permission: BoardPermission;
};

type TargetSlide = {
  slideId: string | null; // null only for the first slide
  slideNumber: number;
};

interface UserWithTarget extends SafeUserDoc {
  targetBoard: TargetBoard;
  targetSlide: TargetSlide;
}

interface SafeUserWithOptionalTarget
  extends SafeUserDoc,
    Partial<Pick<UserWithTarget, 'targetBoard' | 'targetSlide'>> {}

export interface GwSocket extends Socket {
  data: {
    user: SafeUserWithOptionalTarget;
  };
}

export interface GwSocketWithTarget extends Socket {
  data: {
    user: UserWithTarget;
  };
}
