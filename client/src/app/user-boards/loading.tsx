import { SidebarSkeleton } from "@/components/loading/Sidebar";
import { HeaderSkeleton } from "@/components/loading/user-boards/Header";
import { TabButtonsSkeleton } from "@/components/loading/user-boards/TabButtons";
import { BoardTableSkeleton } from "@/components/loading/user-boards/BoardTable";
import { ActionButtonsSkeleton } from "@/components/loading/user-boards/ActionButtons";

export default function LoadingUserBoardsSkeleton() {
  return (
    <div className="h-min-[100vh] flex flex-col">
      <HeaderSkeleton />
      <div className="flex">
        <SidebarSkeleton count={3} className={"border-r"} withSettings={true} />
        <main className="flex-1 bg-background p-6">
          <div className="mb-2 flex items-center justify-between">
            <TabButtonsSkeleton />
            <ActionButtonsSkeleton />
          </div>
          <BoardTableSkeleton />
        </main>
      </div>
    </div>
  );
}
