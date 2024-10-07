import { SuperBoard } from '../../../schemas/board/super.board.schema';

export interface PaginatedBoardsResponse {
  boards: BoardWithoutSlidesAndPermissions[];
  page: number;
  limit: number;
  order: string;
  total: number;
}

interface BoardWithoutSlidesAndPermissions
  extends Omit<SuperBoard, 'slides' | 'permissions' | 'owner'> {
  permission: string;
}
