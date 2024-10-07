import { SuperBoardDocument } from '../../schemas/board/super.board.schema';

export type SuperBoardWithoutSlides = Omit<SuperBoardDocument, 'slides'>;
