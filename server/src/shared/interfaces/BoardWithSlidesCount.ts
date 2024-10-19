import { SuperBoardDocument } from '../../mongo/schemas/board/super.board.schema';

export interface BoardWithSlidesCount
  extends Omit<SuperBoardDocument, 'slides'> {
  slidesCount: number;
}
