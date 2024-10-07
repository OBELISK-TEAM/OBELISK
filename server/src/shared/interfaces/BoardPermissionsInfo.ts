import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export interface BoardPermissionsInfo
  extends Pick<SuperBoardDocument, 'permissions' | 'owner'> {}
