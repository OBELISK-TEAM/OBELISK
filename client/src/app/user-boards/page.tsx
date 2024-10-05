"use client";
import Header from "@/components/user-boards/Header";
import BoardTable from "@/components/user-boards/board-table/BoardTable";
import CreateBoardButton from "@/components/user-boards/CreateBoardButton";
import TabButtons from "@/components/user-boards/TabButtons";
import { CreateBoardProvider } from "@/contexts/CreateBoardContext";
import { useState } from "react";
import { BoardsActiveTab } from "@/enums/BoardsActiveTab";

const tabs = [
  { label: "Owned by you", value: BoardsActiveTab.OWNED_BY_YOU },
  { label: "Shared by others", value: BoardsActiveTab.SHARED_BY_OTHERS },
];

export default function UserBoards() {
  const [activeTab, setActiveTab] = useState<BoardsActiveTab>(BoardsActiveTab.OWNED_BY_YOU);

  const handleTabChange = (tabValue: BoardsActiveTab) => {
    setActiveTab(tabValue);
  };

  return (
    <div className="h-min-[100vh] flex flex-col">
      <CreateBoardProvider>
        <Header />
        <div className="flex">
          <main className="flex-1 bg-background p-6">
            <div className="mb-2 flex items-center justify-between">
              <TabButtons tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
              <CreateBoardButton />
            </div>
            <BoardTable activeTab={activeTab} />
          </main>
        </div>
      </CreateBoardProvider>
    </div>
  );
}
