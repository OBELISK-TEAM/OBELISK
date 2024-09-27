import { Skeleton } from "@/components/ui/skeleton";

export const ActionButtonsSkeleton = () => (
  <div className="flex space-x-2">
    <Skeleton className="h-10 w-20" />
    <Skeleton className="h-10 w-20" />
    <Skeleton className="h-10 w-32" />
  </div>
);
