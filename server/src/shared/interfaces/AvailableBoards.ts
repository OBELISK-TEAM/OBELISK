import { BoardPermissions } from './BoardPermissions';

export interface AvailableBoards extends BoardPermissions {
  owner: string[];
}
