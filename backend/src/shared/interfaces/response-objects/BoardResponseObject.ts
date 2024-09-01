export interface IBoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions: {
    edit: string[];
    view: string[];
    share: string[];
  };
  slides?: string[];
}

export class BoardResponseObject implements IBoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions: {
    edit: string[];
    view: string[];
    share: string[];
  };
  slides?: string[];
}