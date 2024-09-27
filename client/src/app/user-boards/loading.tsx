import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBoard() {
  return (
    <div className="flex flex-col">
      {/* Horizontal Menu Skeleton */}
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
      <div className="flex">
        {/* Sidebar Skeleton */}
        <div
          className="group relative flex w-[56px] flex-col overflow-hidden border-r bg-background"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex flex-1 flex-col space-y-4 p-2">
            <div className="grow">
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
            </div>
            <div className="mt-auto border-t pt-3">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        {/* Sidebar Skeleton */}
        <div
          className="group relative flex w-[56px] flex-col overflow-hidden border-l bg-background"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex flex-1 flex-col space-y-4 p-2">
            <div className="grow">
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
              <Skeleton className="mb-2 h-10 w-full" />
            </div>
          </div>
        </div>

        <div
          className="flex flex-col items-center bg-muted text-muted-foreground"
          style={{ width: `calc(100% - ${2 * 56}px)` }}
        >
          <Skeleton className="h-[50px] w-full" />

          <div className="flex flex-col items-center justify-center">
            <div className="mt-4 flex w-fit rounded-lg bg-background">
              <Skeleton className="h-[550px] w-[1200px] rounded-lg border bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
