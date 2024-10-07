// fetchBoards.ts
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { BoardPermission } from "@/enums/BoardPermission";

export const fetchBoards =
  (accessToken: string) =>
  async (url: string): Promise<PaginatedBoardsResponse> => {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }

    const jsonData = await response.json();

    const boards = jsonData.boards.map((board: any): BoardResponse => {
      return {
        _id: board._id,
        name: board.name,
        createdAt: board.createdAt,
        modifiedAt: board.updatedAt,
        permission: board.permission as BoardPermission,
        size: 200,
        slides: [],
        owner: board.owner || "",
      };
    });

    return {
      data: boards,
      page: jsonData.page,
      limit: jsonData.limit,
      total: jsonData.total,
    };
  };
