import { Skeleton } from "@/components/ui/skeleton";

export const HorizontalMenuSkeleton = () => (
  <div className="flex h-[64px] items-center justify-between border-b bg-background px-4 pl-0">
    <div className="flex items-center">
      <Skeleton className="h-[64px] w-[56px] border-r" />
      <Skeleton className="ml-6 h-6 w-32" />
      <div className="ml-4 flex items-center space-x-2 overflow-x-auto px-4">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
    <div className="flex items-center space-x-4 border-l pl-4 pr-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
);
