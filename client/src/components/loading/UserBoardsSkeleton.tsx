import { Skeleton } from "@/components/ui/skeleton";
import { BoardTableSkeleton } from "@/components/loading/BoardTableSkeleton";

const UserBoardsSkeleton = () => (
  <main className="flex-1 bg-background p-6">
    loading
    <div className="mb-2 flex items-center justify-between">
      <div className="flex space-x-2 rounded-lg bg-muted p-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div>
      <Skeleton className="h-10 w-40" />
    </div>
    <BoardTableSkeleton />
  </main>
);

export default UserBoardsSkeleton;
