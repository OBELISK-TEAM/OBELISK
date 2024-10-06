// fetchBoards.ts
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { PermissionsResponse } from "@/interfaces/responses/permissions-response";
import { BoardsActiveTab } from "@/enums/BoardsActiveTab";
import { BoardPermission } from "@/enums/BoardPermission";

export const fetchBoards = (url: string): Promise<PaginatedBoardsResponse> => {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const tab = urlParams.get("tab") as BoardsActiveTab;
    const page = parseInt(urlParams.get("page") || "1", 10);
    const perPage = parseInt(urlParams.get("perPage") || "5", 10);

    setTimeout(() => {
      let total = 0;
      let data: BoardResponse[] = [];

      const generatePermissionsResponse = (i: number): PermissionsResponse => {
        return {
          viewer: i % 3 === 0 ? ["Bob", "Charlie", "Megan"] : [],
          editor: i % 3 === 1 ? ["Piotr"] : [],
          moderator: i % 3 === 1 ? ["Alice", "Josh", "Liam", "Mateo"] : ["Bob"],
        };
      };

      if (tab === BoardsActiveTab.OWNED_BY_CURRENT_USER) {
        for (let i = 1; i <= 40; i++) {
          data.push({
            _id: "" + i,
            name: `Your Board ${i}`,
            modifiedAt: `2023-09-${i.toString().padStart(2, "0")} 08:00 PM`,
            createdAt: `2023-09-10 07:00 PM`,
            permissions: generatePermissionsResponse(i),
            size: i * 15,
            currentUserPermission: BoardPermission.OWNER,
            slides: [],
          });
        }
      } else if (tab === BoardsActiveTab.SHARED_FOR_CURRENT_USER) {
        for (let i = 1; i <= 30; i++) {
          data.push({
            _id: "" + i,
            name: `Shared Board ${i}`,
            owner: `User ${i}`,
            modifiedAt: `2023-09-${i.toString().padStart(2, "0")} 01:00 PM`,
            createdAt: `2023-09-05 12:00 PM`,
            currentUserPermission:
              i % 4 === 0
                ? BoardPermission.EDITOR
                : i % 4 === 1
                  ? BoardPermission.VIEWER
                  : i % 4 === 2
                    ? BoardPermission.MODERATOR
                    : BoardPermission.OWNER,
            permissions: generatePermissionsResponse(i),
            size: i * 20,
            slides: [],
          });
        }
      } else {
        data = [];
      }

      total = data.length;
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = data.slice(startIndex, endIndex);

      resolve({
        data: paginatedData,
        total,
        page: page,
        limit: perPage,
      });
    }, 1000);
  });
};
