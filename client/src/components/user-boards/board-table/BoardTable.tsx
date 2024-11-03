import { FilterIcon, Share2, ViewIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BoardsPagination } from "../BoardsPagination";
import { getColumnsForTab, getDescriptionForTab, getTitleForTab } from "@/lib/userBoardsUtils";
import { Button } from "@/components/ui/button";
import { CellContent } from "@/components/user-boards/board-table/CellContent";

import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { BoardsActiveTab, BoardsActiveTabMap } from "@/enums/BoardsActiveTab";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import { BoardTableLeadRow } from "@/components/user-boards/board-table/BoardTableLeadRow";
import { useRouter } from "next/navigation";
import { BoardDeletionButton } from "@/components/user-boards/board-table/BoardDeletionButton";
import { BoardDetailsButton } from "@/components/user-boards/board-table/BoardDetailsButton";
import { deleteBoard } from "@/app/actions/boardActions";
import ShareBoardDialog from "@/components/board-details/board-permissions/ShareBoardDialog";

interface BoardTableProps {
  data: PaginatedBoardsResponse;
  activeTab: BoardsActiveTab;
  currentPage: number;
}

const BoardTable: React.FC<BoardTableProps> = ({ data, activeTab }) => {
  const router = useRouter();

  const handleRowClick = (boardId: string) => {
    router.push(`/user-boards/${boardId}/slides/1`);
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      const tabString = BoardsActiveTabMap[activeTab];
      const query = `tab=${tabString}&page=${newPage}`;
      const href = `/user-boards?${query}`;
      router.replace(href);
    },
    [activeTab, router]
  );

  if (!data || data.boards.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="text-muted-foreground">No boards found</p>
      </div>
    );
  }

  const columns = getColumnsForTab(activeTab);

  return (
    <div className="flex max-h-[570px] min-h-[570px] flex-col rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-start justify-between">
        <BoardHeader title={getTitleForTab(activeTab)} description={getDescriptionForTab(activeTab)} />
        <div className="flex space-x-2">
          <Button variant="outline">
            <FilterIcon className="mr-2 h-5 w-5" />
            Filter
          </Button>
          <Button variant="outline">
            <ViewIcon className="mr-2 h-5 w-5" />
            View
          </Button>
        </div>
      </div>
      <div className="relative flex-grow">
        <Table className="w-full">
          <BoardTableLeadRow columns={columns} />
          <TableBody className={"min-h-[800px]"}>
            {data &&
              data.boards.length > 0 &&
              data.boards.map((board: BoardResponse) => (
                <TableRow
                  key={board._id}
                  className="cursor-pointer border-b hover:bg-muted/50"
                  onClick={() => handleRowClick(board._id)}
                >
                  {columns.map((col) => (
                    <TableCell key={col} className="py-2">
                      {CellContent(col, board)}
                    </TableCell>
                  ))}
                  <TableCell
                    className="flex items-center justify-center space-x-1"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <ShareBoardDialog boardId={board._id}>
                      <Button
                        variant="outline"
                        className="px-2 hover:text-muted-foreground"
                        style={{ width: "40px" }}
                        aria-label="Share with others"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </ShareBoardDialog>
                    <BoardDeletionButton
                      revalidateFunc={() => router.refresh()}
                      deleteBoard={() => deleteBoard(board._id)}
                    />
                    <BoardDetailsButton boardId={board._id} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="w-[18em] grow text-muted-foreground" style={{ fontSize: "15px" }}>
          Showing {(data.page - 1) * data.limit + 1}-{Math.min(data.page * data.limit, data.total)} of {data.total}{" "}
          boards
        </span>
        <BoardsPagination
          currentPage={data.page}
          totalPages={Math.ceil(data.total / data.limit)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};
export default BoardTable;
