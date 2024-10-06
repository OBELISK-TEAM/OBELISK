import { FilterIcon, TrashIcon, ViewIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BoardsPagination } from "../BoardsPagination";
import { fetchBoards } from "@/mock-data/BoardsFetcher";
import { getColumnsForTab, getDescriptionForTab, getTitleForTab } from "@/lib/userBoardsUtils";
import { Button } from "@/components/ui/button";
import { CellContent } from "@/components/user-boards/board-table/CellContent";
import { BoardTableSkeleton } from "@/components/loading/BoardTableSkeleton";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { BoardsActiveTab } from "@/enums/BoardsActiveTab";
import { BoardHeader } from "@/components/user-boards/board-table/BoardHeader";
import { BoardTableLeadRow } from "@/components/user-boards/board-table/BoardTableLeadRow";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";

interface BoardTableProps {
  activeTab: BoardsActiveTab;
}

const BoardTable: React.FC<BoardTableProps> = ({ activeTab }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const router = useRouter();
  const [previousData, setPreviousData] = useState<PaginatedBoardsResponse | undefined>(undefined);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const { data, error, isLoading } = useSWR<PaginatedBoardsResponse>(
    `/api/boards?tab=${activeTab}&page=${currentPage}&perPage=${perPage}`,
    fetchBoards,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (data) {
      setPreviousData(data);
    }
  }, [data]);

  const handleRowClick = (boardId: string) => {
    router.push(`/user-boards/${boardId}/slides/0`);
  };
  const handleDetailsButtonClick = (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation(); // Prevent triggering row's onClick
    router.push(`/user-boards/${boardId}`);
  };
  const showOverlay = isLoading && previousData;

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className={"text-red-600"}>{error.message} || Failed to load data.</p>
      </div>
    );
  }

  if (!previousData && isLoading) {
    return <BoardTableSkeleton />;
  }
  const displayData = data || previousData;

  const columns = getColumnsForTab(activeTab);

  return (
    <div className="relative">
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start justify-between">
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
        <div className="relative">
          <Table className="w-full">
            <BoardTableLeadRow columns={columns} />
            <TableBody>
              {displayData &&
                displayData.data.length > 0 &&
                displayData.data.map((board: BoardResponse) => (
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
                    <TableCell className="flex items-center justify-center space-x-1">
                      <Button variant={"outline"} className="hover:text-muted-foreground">
                        <TrashIcon />
                      </Button>
                      <HoverCard openDelay={100} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <Button
                            variant={"outline"}
                            className="hover:text-muted-foreground"
                            onClick={(e) => handleDetailsButtonClick(e, board._id)}
                            aria-label="Go to board details"
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="max-w-36">
                          Go to board details
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {showOverlay && (
            <div className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-background opacity-60">
              <LoadingSpinner className="h-8 w-8 text-gray-500" />
            </div>
          )}

          {displayData && (
            <div className="mt-4 flex items-center justify-between">
              <span className="w-[18em] grow text-muted-foreground" style={{ fontSize: "15px" }}>
                Showing {(displayData.page - 1) * displayData.limit + 1}-
                {Math.min(displayData.page * displayData.limit, displayData.total)} of {displayData.total} boards
              </span>
              <BoardsPagination
                currentPage={displayData.page}
                totalPages={Math.ceil(displayData.total / displayData.limit)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardTable;
