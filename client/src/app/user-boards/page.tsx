"use client";
import Sidebar from "@/components/user-boards/Sidebar";
import Header from "@/components/user-boards/Header";
import BoardTable from "@/components/user-boards/BoardTable";
import UserBoardsActionButtons from "@/components/user-boards/UserBoardsActionButtons";
import TabButtons from "@/components/user-boards/TabButtons";
import { CreateBoardProvider } from "@/contexts/CreateBoardContext";

export default function UserBoards() {
  const tabs = [{ label: "All" }, { label: "Shared by others" }, { label: "Archived" }];

  return (
    <div className="h-min-[100vh] flex flex-col">
      <CreateBoardProvider>
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 bg-background p-6">
            <div className="mb-2 flex items-center justify-between">
              <TabButtons tabs={tabs} />
              <UserBoardsActionButtons />
            </div>
            <BoardTable />
          </main>
        </div>
      </CreateBoardProvider>
    </div>
  );
}
