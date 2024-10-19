import { BoardWithSlidesCount } from './BoardWithSlidesCount';
import { BoardPermission } from '../enums/board.permission';

export interface ClientBoardInfo
  extends Omit<BoardWithSlidesCount, 'permissions'> {
  permission: BoardPermission;
}
