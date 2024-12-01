import { SuperBoardDocument } from '../../modules/mongo/schemas/board/super.board.schema';

export interface BoardWithSlideCount
  extends Omit<SuperBoardDocument, 'slides'> {
  slideCount: number;
}
