import { SuperBoardDocument } from '../../mongo/schemas/board/super.board.schema';
import { UserPermission } from './UserPermission';

export interface BoardWithPopulatedPermissions
  extends Omit<SuperBoardDocument, 'permissions' | 'owner'> {
  permissions: {
    viewer: UserPermission[];
    editor: UserPermission[];
    moderator: UserPermission[];
  };
  owner: UserPermission;
  permission: string;
}
