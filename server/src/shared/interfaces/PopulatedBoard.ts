import { SuperBoardDocument } from '../../schemas/board/super.board.schema';
import { UserPermission } from './UserPermission';

export interface BoardWithPopulatedPermissions
  extends Omit<SuperBoardDocument, 'slides' | 'permissions' | 'owner'> {
  permissions: {
    viewer: UserPermission[];
    editor: UserPermission[];
    moderator: UserPermission[];
  };
  owner: UserPermission;
  permission: string;
}
