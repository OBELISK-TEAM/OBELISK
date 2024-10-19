import { BoardPermission } from '../../../shared/enums/board.permission';
import { SetMetadata } from '@nestjs/common';

export const MINIMUM_BOARD_PERMISSION_KEY = 'minimumBoardPermission';

export const MinimumBoardPermission = (permission: BoardPermission) =>
  SetMetadata(MINIMUM_BOARD_PERMISSION_KEY, permission);
