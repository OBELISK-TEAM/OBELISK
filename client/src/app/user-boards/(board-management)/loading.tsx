import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = () => {
  return (
    <main className="flex-1 bg-background p-6">
      loading
      <div className="mb-2 flex items-center justify-between">
        <div className="flex space-x-2 rounded-lg bg-muted p-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="w-full rounded-lg border bg-card p-4">
        <Skeleton className="mb-2 h-6 w-32" />
        <Skeleton className="mb-4 h-4 w-48" />
        <div className="mb-4 flex w-full justify-evenly">
          <Skeleton className="mr-2 h-8 flex-1" />
          <Skeleton className="mr-2 h-8 flex-1" />
          <Skeleton className="mr-2 h-8 flex-1" />
          <Skeleton className="mr-2 h-8 flex-1" />
          <Skeleton className="mr-2 h-8 flex-1" />
        </div>
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="mb-2 flex w-full">
            <Skeleton className="mr-2 h-8 flex-1" />
            <Skeleton className="mr-2 h-8 flex-1" />
            <Skeleton className="mr-2 h-8 flex-1" />
            <Skeleton className="mr-2 h-8 flex-1" />
            <Skeleton className="mr-2 h-8 flex-1" />
          </div>
        ))}
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </main>
  );
};

export default LoadingPage;
