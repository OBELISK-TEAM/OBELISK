export interface JoinBoardResponse {
  _id: string;
  name: string;
  owner: string;
  slidesCount: number;
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
