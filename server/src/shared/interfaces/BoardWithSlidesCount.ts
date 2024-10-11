import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export interface BoardWithSlidesCount
  extends Omit<SuperBoardDocument, 'slides'> {
  slidesCount: number;
}
