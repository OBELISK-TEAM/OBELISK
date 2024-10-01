export interface BoardResponse {
  id: number;
  name: string;
  modifiedAt: string;
  createdAt: string;
  size: number;
  sharedWith: string[];
  owner?: string;
  yourPermission?: string;
}
