import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BoardTable from "@/components/BoardTable";
import UserBoardsActionButtons from "@/components/UserBoardsActionButtons";
import TabButtons from "@/components/TabButtons";

export default async function UserBoards() {
  await new Promise((resolve) => setTimeout(resolve, 8000));
  const tabs = [{ label: "All" }, { label: "Shared by others" }, { label: "Archived" }];

  return (
    <div className="h-min-[100vh] flex flex-col">
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
    </div>
  );
}
