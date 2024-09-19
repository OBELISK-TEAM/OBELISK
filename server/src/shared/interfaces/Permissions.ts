export interface Permissions {
  viewer: string[];
  editor: string[];
  moderator: string[];
}

export interface Permissions2 extends Permissions {
  owner: string[];
}
