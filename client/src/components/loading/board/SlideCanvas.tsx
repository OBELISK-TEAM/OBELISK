import { Skeleton } from "@/components/ui/skeleton";
import { SlideControlsSkeleton } from "@/components/loading/board/SlideControls";

export const SlideCanvasSkeleton = () => (
  <div
    className="flex flex-col items-center bg-muted text-muted-foreground"
    style={{ width: `calc(100% - ${2 * 56}px)` }}
  >
    <Skeleton className="h-[50px] w-full" />

    <div className="flex flex-col items-center justify-center">
      <div className="mt-4 flex w-fit rounded-lg bg-background">
        <Skeleton className="h-[550px] w-[1200px] rounded-lg border bg-white" />
      </div>
      <SlideControlsSkeleton />
    </div>
  </div>
);
