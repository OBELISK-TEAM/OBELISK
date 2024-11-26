"use client";

import BoardTable from "@/app/user-boards/(board-management)/_components/board-table/BoardTable";
import CreateBoardButton from "@/app/user-boards/(board-management)/_components/CreateBoardButton";
import TabButtons from "@/components/common/tab-buttons/TabButtons";
import { useState, useEffect } from "react";
import { BoardsActiveTab, BoardsActiveTabMap } from "@/enums/active-tab/BoardsActiveTab";
import { useRouter } from "next/navigation";
import { PaginatedBoardsResponse } from "@/interfaces/responses/user-boards/paginated-boards-response";

const tabs = [
  { label: "Owned by you", value: BoardsActiveTab.OWNED_BY },
  { label: "Shared by others", value: BoardsActiveTab.SHARED_FOR },
];

interface UserBoardsProps {
  data: PaginatedBoardsResponse;
  activeTab: BoardsActiveTab;
  currentPage: number;
}

export default function UserBoards({ data, activeTab, currentPage }: UserBoardsProps) {
  const [activeTabState, setActiveTabState] = useState<BoardsActiveTab>(activeTab);
  const [page, setPage] = useState<number>(currentPage);
  const router = useRouter();

  useEffect(() => {
    const tabString = BoardsActiveTabMap[activeTabState];
    const query = `tab=${tabString}&page=${page}`;
    const href = `/user-boards?${query}`;
    router.replace(href);
  }, [activeTabState, page, router]);

  const handleTabChange = (tabValue: BoardsActiveTab) => {
    setActiveTabState(tabValue);
    setPage(1);
  };
  return (
    <main className="flex-1 bg-background p-6" style={{ height: "calc(100vh - 64px)" }}>
      <div className="mb-2 flex items-center justify-between">
        <TabButtons tabs={tabs} activeTab={activeTabState} onTabChange={handleTabChange} />
        <CreateBoardButton />
      </div>
      <BoardTable data={data} activeTab={activeTabState} currentPage={page} />
    </main>
  );
}
