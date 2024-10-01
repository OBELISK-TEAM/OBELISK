"use client";
import Header from "@/components/user-boards/Header";
import BoardTable from "@/components/user-boards/board-table/BoardTable";
import UserBoardsActionButtons from "@/components/user-boards/UserBoardsActionButtons";
import TabButtons from "@/components/user-boards/TabButtons";
import { CreateBoardProvider } from "@/contexts/CreateBoardContext";
import { useState } from "react";

const tabs = [{ label: "Latest" }, { label: "Owned by you" }, { label: "Shared by others" }];
export default function UserBoards() {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="h-min-[100vh] flex flex-col">
      <CreateBoardProvider>
        <Header />
        <div className="flex">
          <main className="flex-1 bg-background p-6">
            <div className="mb-2 flex items-center justify-between">
              <TabButtons tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
              <UserBoardsActionButtons />
            </div>
            <BoardTable activeTab={activeTab} />
          </main>
        </div>
      </CreateBoardProvider>
    </div>
  );
}
