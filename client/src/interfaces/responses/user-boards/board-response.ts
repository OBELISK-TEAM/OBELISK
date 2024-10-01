export interface BoardResponse {
  id: string;
  name: string;
  modifiedAt: string;
  createdAt: string;
  size: number;
  sharedWith: string[];
  owner?: string;
  yourPermission?: string;
}
