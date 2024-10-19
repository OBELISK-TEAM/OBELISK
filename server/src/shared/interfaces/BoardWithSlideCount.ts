import { SuperBoardDocument } from '../../mongo/schemas/board/super.board.schema';

export interface BoardWithSlideCount
  extends Omit<SuperBoardDocument, 'slides'> {
  slideCount: number;
}
