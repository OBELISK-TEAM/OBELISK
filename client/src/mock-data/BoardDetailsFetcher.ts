import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";

export const fetchBoardDetails = async (url: string): Promise<BoardResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const boardId = url.split("/").pop() || "";
  const data = {
    _id: boardId,
    name: "My Board",
    owner: "user123",
    permissions: {
      viewer: ["user1", "user2", "user5", "user6", "user7"],
      editor: ["user3"],
      moderator: ["user4", "user8", "user9", "user10"],
    },
    slides: ["slide1", "slide2", "slide3", "slide4", "slide5", "slide6", "slide7", "slide8", "slide9"],
    createdAt: String(new Date("2024-10-01T08:00:00Z")),
    modifiedAt: String(new Date("2024-10-06T18:00:00Z")),
    maxSize: 100,
    size: 94,
  };
  if (!data) {
    throw new Error("Board not found.");
  }
  return data;
};
