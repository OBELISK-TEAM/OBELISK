import { BoardAction } from './board.action';
import { ObjectAction } from './object.action';
import { SlideAction } from './slide.action';
import { UserAction } from './user.action';

export type GlobalActionType =
  | UserAction
  | BoardAction
  | SlideAction
  | ObjectAction;

export const GlobalActionEnum = {
  ...UserAction,
  ...BoardAction,
  ...SlideAction,
  ...ObjectAction,
};
