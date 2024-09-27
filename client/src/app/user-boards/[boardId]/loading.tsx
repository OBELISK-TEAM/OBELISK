import { SidebarSkeleton } from "@/components/loading/Sidebar";
import { HorizontalMenuSkeleton } from "@/components/loading/board/HorizontalMenu";
import { SlideCanvasSkeleton } from "@/components/loading/board/SlideCanvas";

export default function LoadingBoard() {
  return (
    <div className="flex flex-col">
      <HorizontalMenuSkeleton />
      <div className="flex">
        <SidebarSkeleton count={6} className={"border-r"} withSettings={true} />

        <SidebarSkeleton count={3} className={"border-l"} />

        <SlideCanvasSkeleton />
      </div>
    </div>
  );
}
