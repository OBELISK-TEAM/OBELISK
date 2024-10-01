import { FilterIcon, TrashIcon, ViewIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BoardsPagination } from "../BoardsPagination";
import { fetchBoards } from "@/mock-data/BoardsFetcher";
import { getColumnsForTab, getDescriptionForTab, getTitleForTab } from "@/lib/UserBoardsUtils";
import { Button } from "@/components/ui/button";
import { CellContent } from "@/components/board-table/CellContent";
import { BoardTableSkeleton } from "@/components/loading/BoardTableSkeleton";
import { LoadingSpinner } from "@/components/loading/LoadingSpinner";
import { BoardsResponse } from "@/interfaces/boards/boards-response";
import { BoardResponse } from "@/interfaces/boards/board-response";

interface IBoardTable {
  activeTab: string;
}

const BoardTable: React.FC<IBoardTable> = ({ activeTab }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const [previousData, setPreviousData] = useState<BoardsResponse | undefined>(undefined);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const { data, error, isLoading } = useSWR<BoardsResponse>(
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
          <div>
            <h1 className="font-bold text-card-foreground" style={{ fontSize: "20px" }}>
              {getTitleForTab(activeTab)}
            </h1>
            <span className="text-muted-foreground" style={{ fontSize: "15px" }}>
              {getDescriptionForTab(activeTab)}
            </span>
          </div>
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
            <TableHeader className="text-muted-foreground">
              <TableRow className="border-b">
                {columns.map((col) => (
                  <TableHead key={col} className="left py-2">
                    {col}
                  </TableHead>
                ))}
                <TableHead className="py-2 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData &&
                displayData.data.length > 0 &&
                displayData.data.map((board: BoardResponse) => (
                  <TableRow key={board.id} className="border-b hover:bg-muted/50">
                    {columns.map((col) => (
                      <TableCell key={col} className="py-2">
                        {CellContent(col, board)}
                      </TableCell>
                    ))}
                    <TableCell className="flex items-center justify-center space-x-1">
                      <Button variant={"outline"} className="hover:text-muted-foreground">
                        <TrashIcon />
                      </Button>
                      <Button variant={"outline"} className="hover:text-muted-foreground">
                        <ChevronRightIcon />
                      </Button>
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
                Showing {(displayData.currentPage - 1) * displayData.perPage + 1}-
                {Math.min(displayData.currentPage * displayData.perPage, displayData.total)} of {displayData.total}{" "}
                boards
              </span>
              <BoardsPagination
                currentPage={displayData.currentPage}
                totalPages={Math.ceil(displayData.total / displayData.perPage)}
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
