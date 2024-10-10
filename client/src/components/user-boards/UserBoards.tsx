"use client";
import BoardTable from "@/components/user-boards/board-table/BoardTable";
import CreateBoardButton from "@/components/user-boards/CreateBoardButton";
import TabButtons from "@/components/user-boards/TabButtons";
import { useState } from "react";
import { BoardsActiveTab } from "@/enums/BoardsActiveTab";

const tabs = [
  { label: "Owned by you", value: BoardsActiveTab.OWNED_BY },
  { label: "Shared by others", value: BoardsActiveTab.SHARED_FOR },
];

export default function UserBoards({ accessToken }: { accessToken?: string }) {
  const [activeTab, setActiveTab] = useState<BoardsActiveTab>(BoardsActiveTab.OWNED_BY);

  const handleTabChange = (tabValue: BoardsActiveTab) => {
    setActiveTab(tabValue);
  };

  return (
    <main className="flex-1 bg-background p-6">
      <div className="mb-2 flex items-center justify-between">
        <TabButtons tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        <CreateBoardButton />
      </div>
      <BoardTable activeTab={activeTab} accessToken={accessToken} />
    </main>
  );
}
