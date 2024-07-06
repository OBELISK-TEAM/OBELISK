import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BoardTable from "@/components/BoardTable";
import { PaginationDemo } from "@/components/PaginationDemo";
import { Button } from "@/components/ui/button";
import ActionButtons from "@/components/ActionButtons";
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
        <main className="flex-1 p-4 bg-white">
          <div className="bg-white p-4 ">
            <div className="flex justify-between items-center mb-4">
              <TabButtons tabs={tabs} />
              <ActionButtons />
            </div>
            <BoardTable />
          </div>
        </main>
      </div>
    </div>
  );
}
