export interface BoardResponseObject {
  _id: string;
  name: string;
  owner: string;
  permissions: {
    edit: string[];
    view: string[];
    share: string[];
  };
  slides?: string[];
  createdAt?: Date | string | boolean | undefined;
  updatedAt?: Date | string | boolean | undefined;
}
