import { Skeleton } from "@/components/ui/skeleton";

export const SlidePaginationSkeleton = () => (
  <div className="flex max-w-[33%] flex-grow justify-center">
    <Skeleton className="h-8 w-40 bg-background" />
  </div>
);
