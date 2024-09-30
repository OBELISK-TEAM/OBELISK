"use client";
import Header from "@/components/Header";
import BoardTable from "@/components/board-table/BoardTable";
import UserBoardsActionButtons from "@/components/UserBoardsActionButtons";
import TabButtons from "@/components/TabButtons";
import { useState } from "react";

const tabs = [{ label: "Latest" }, { label: "Owned by you" }, { label: "Shared by others" }];
export default function UserBoards() {
  const [activeTab, setActiveTab] = useState(tabs[0].label);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="h-min-[100vh] flex flex-col">
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
    </div>
  );
}
