import { BoardResponseObject } from './BoardResponseObject';

export interface UserRelatedBoardsPaginatedResponseObject {
  boardsPaginated: BoardResponseObject[];
  currentPage: number;
  limit: number;
  totalPages: number;
}
