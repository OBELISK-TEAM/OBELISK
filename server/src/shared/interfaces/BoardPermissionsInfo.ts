import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export interface BoardPermissionsInfo
  extends Pick<SuperBoardDocument, '_id' | 'permissions' | 'owner'> {}
