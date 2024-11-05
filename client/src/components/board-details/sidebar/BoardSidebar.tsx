import React, { Suspense } from "react";
import SidebarContent from "./SidebarContent";
import LoadingSidebar from "@/components/loading/LoadingSidebar";

interface BoardDetailsSidebarProps {
  boardId: string;
}

const BoardSidebar: React.FC<BoardDetailsSidebarProps> = ({ boardId }) => {
  return (
    <div
      className="transition-width group sticky top-[64px] flex w-14 flex-col justify-between border-r border-border bg-background shadow-md duration-300 ease-in-out hover:w-52"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Suspense fallback={<LoadingSidebar />}>
        <SidebarContent boardId={boardId} />
      </Suspense>
    </div>
  );
};

export default BoardSidebar;
