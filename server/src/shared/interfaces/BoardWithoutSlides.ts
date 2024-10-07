import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export interface UserPermission {
  _id: string;
  email: string;
}

export interface BoardWithPopulatedPermissions
  extends Omit<SuperBoardDocument, 'slides' | 'permissions' | 'owner'> {
  permissions: {
    viewer: UserPermission[];
    editor: UserPermission[];
    moderator: UserPermission[];
  };
  owner: UserPermission;
}

export interface BoardWithoutSlides
  extends Omit<SuperBoardDocument, 'slides'> {}
