export interface SimpleMessage {
  message: string;
}

export interface BasicUserInfo {
  email: string;
  _id: string;
}

export interface JoinBoardResponse {
  _id: string;
  name: string;
  owner: string;
  slideCount: number;
  permission: "OWNER" | "MODERATOR" | "EDITOR" | "VIEWER";
}

export interface JoinSlideResponse {
  _id: string;
  version: string;
  objects: object[];
  slideNumber: number;
}

export interface SlideAddedResponse extends JoinSlideResponse {}

export interface SlideDeletedResponse extends JoinSlideResponse {}
