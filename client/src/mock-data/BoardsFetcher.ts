import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { BoardsResponse } from "@/interfaces/responses/user-boards/boards-response";

export const fetchBoards = (url: string): Promise<BoardsResponse> => {
  return new Promise((resolve) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const tab = urlParams.get("tab");
    const page = parseInt(urlParams.get("page") || "1", 10);
    const perPage = parseInt(urlParams.get("perPage") || "5", 10);

    setTimeout(() => {
      let total = 0;
      let data: BoardResponse[] = [];

      if (tab === "Latest") {
        for (let i = 1; i <= 27; i++) {
          data.push({
            id: i,
            name: `Latest Board ${i}`,
            owner: `Owner ${i}`,
            modifiedAt: `2023-10-${i.toString().padStart(2, "0")} 10:00 AM`,
            createdAt: `2023-09-15 09:00 AM`,
            yourPermission: i % 4 === 0 ? "Editing" : i % 4 === 1 ? "Reading" : i % 4 === 2 ? "Sharing" : "Owner",
            sharedWith: i % 3 === 0 ? ["Bob", "Charlie"] : ["Alice"],
            size: i * 10,
          });
        }
      } else if (tab === "Owned by you") {
        for (let i = 1; i <= 40; i++) {
          data.push({
            id: i,
            name: `Your Board ${i}`,
            modifiedAt: `2023-09-${i.toString().padStart(2, "0")} 08:00 PM`,
            createdAt: `2023-09-10 07:00 PM`,
            sharedWith: i % 2 === 0 ? ["Dave", "Emma"] : [],
            size: i * 15,
          });
        }
      } else if (tab === "Shared by others") {
        for (let i = 1; i <= 30; i++) {
          data.push({
            id: i,
            name: `Shared Board ${i}`,
            owner: `User ${i}`,
            modifiedAt: `2023-09-${i.toString().padStart(2, "0")} 01:00 PM`,
            createdAt: `2023-09-05 12:00 PM`,
            yourPermission: i % 2 === 0 ? "Sharing" : "Reading",
            sharedWith: i % 3 === 0 ? ["Bob", "Charlie", "Megan"] : ["Alice", "Josh", "Liam", "Mateo"],
            size: i * 20,
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
        currentPage: page,
        perPage,
      });
    }, 1000);
  });
};
