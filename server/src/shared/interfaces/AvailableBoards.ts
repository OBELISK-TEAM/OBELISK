import { Permissions } from './Permissions';

export interface AvailableBoards extends Permissions {
  owner: string[];
}
