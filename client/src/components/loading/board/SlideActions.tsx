import { Skeleton } from "@/components/ui/skeleton";

export const SlideActionsSkeleton = () => (
  <div className="flex max-w-[33%] flex-grow items-center justify-end space-x-4">
    <Skeleton className="h-10 w-32 rounded bg-background" />
    <Skeleton className="h-10 w-32 rounded bg-background" />
  </div>
);
