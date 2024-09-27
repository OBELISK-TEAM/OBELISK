// app/[boardId]/[slideIndex]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBoard() {
  return (
    <div className="flex flex-col">
      {/* Skeleton for BoardHorizontalMenu */}
      <Skeleton className="h-[64px] w-full" />

      <div className="flex">
        {/* Skeleton for Left BoardSidebar */}
        <div
          className="group relative flex w-[56px] flex-col overflow-hidden border-r bg-background"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex flex-1 flex-col space-y-4 p-2">
            {/* Sidebar Items Skeleton */}
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="mb-2 h-10 w-full" />
            {/* Add more as needed */}
            {/* Settings Icon Skeleton */}
            <div className="mt-auto border-t pt-3">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Skeleton for Right BoardSidebar */}
        <div
          className="group relative flex w-[56px] flex-col overflow-hidden border-l bg-background"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex flex-1 flex-col space-y-4 p-2">
            {/* Sidebar Items Skeleton */}
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="mb-2 h-10 w-full" />
            {/* Add more as needed */}
          </div>
        </div>

        {/* Skeleton for Main Content Area */}
        <div
          className="flex flex-col items-center bg-muted text-muted-foreground"
          style={{ width: `calc(100% - ${2 * 56}px)` }}
        >
          {/* Skeleton for BoardToolBar */}
          <Skeleton className="h-[50px] w-full" />

          {/* Skeleton for SlideCanvas */}
          <div className="flex flex-col">
            <div className="mt-4 flex w-fit rounded-lg bg-white">
              <Skeleton className="h-[550px] w-[1200px] rounded-lg border" />
            </div>
            {/* Skeleton for SlideControls */}
            <div className="mt-2 flex space-x-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
              {/* Add more as needed */}
            </div>
          </div>

          {/* Skeleton for SlideFileInputs */}
          <div className="mt-4 flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            {/* Add more as needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
