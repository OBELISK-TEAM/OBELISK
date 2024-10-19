import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";

export const fetchBoardDetails = async (url: string): Promise<BoardDetailsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const boardId = url.split("/").pop() || "";
  const data: BoardDetailsResponse = {
    _id: boardId,
    name: "example name",
    owner: {
      _id: "66f84e34a7a2011139c498e5",
      email: "psyduck281@gmail.com",
    },
    permission: "MODERATOR",
    permissions: {
      viewer: [{ _id: "66f921d2367f31f538621c49", email: "3psyduck281@gmail.com" }],
      editor: [],
      moderator: [{ _id: "66f921b5367f31f538621c45", email: "2psyduck281@gmail.com" }],
    },
    sizeInBytes: 13158,
    createdAt: "2024-10-02T17:03:12.309Z",
    updatedAt: "2024-10-09T15:01:26.095Z",
    maxSizeInBytes: 4206969,
    slidesCount: 10,
  };

  if (!data) {
    throw new Error("Board not found.");
  }

  return data;
};
