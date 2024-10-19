import { BoardWithSlideCount } from './BoardWithSlideCount';
import { BoardPermission } from '../enums/board.permission';

export interface ClientBoardInfo
  extends Omit<BoardWithSlideCount, 'permissions'> {
  permission: BoardPermission;
}
