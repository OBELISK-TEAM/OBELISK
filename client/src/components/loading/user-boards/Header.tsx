import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => (
  <div className="flex h-[64px] items-center justify-between border-b bg-background pl-0">
    <div className="flex items-center">
      <Skeleton className="h-[64px] w-[56px] border-r" />
      <div className="ml-4 flex space-x-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
    <div className="flex items-center space-x-4 pr-6">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);
