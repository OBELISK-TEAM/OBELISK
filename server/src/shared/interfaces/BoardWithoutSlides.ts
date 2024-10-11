import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export interface BoardWithoutSlides
  extends Omit<SuperBoardDocument, 'slides'> {}
