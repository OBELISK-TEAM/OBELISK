import { BoardDataResponse } from "@/interfaces/responses/board-data-response";

export const defaultBoardData: BoardDataResponse = {
  _id: "-1",
  name: "Loading...",
  owner: "Loading...",
  permissions: {
    viewer: [],
    editor: [],
    moderator: [],
  },
  slides: [],
  slide: {
    _id: "-1",
    version: "1",
    objects: [],
    board: "-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
