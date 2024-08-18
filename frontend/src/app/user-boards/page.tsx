"use client";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BoardTable from "@/components/BoardTable";
import UserBoardsActionButtons from "@/components/UserBoardsActionButtons";
import TabButtons from "@/components/TabButtons";

export default function UserBoards() {
  const tabs = [
    { label: "All" },
    { label: "Shared by others" },
    { label: "Archived" },
  ];

  return (
    <div className="flex flex-col h-min-[100vh]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 bg-background">
            <div className="flex justify-between items-center mb-2">
              <TabButtons tabs={tabs} />
              <UserBoardsActionButtons />
            </div>
            <BoardTable />
        </main>
      </div>
    </div>
  );
}
