import React, { Suspense } from "react";
import BoardDetailsSidebarContent from "./BoardDetailsSidebarContent";
import LoadingSidebar from "@/app/user-boards/(board-management)/[boardId]/_loading/LoadingSidebar";

interface BoardDetailsSidebarProps {
  boardId: string;
}

const BoardDetailsSidebar: React.FC<BoardDetailsSidebarProps> = ({ boardId }) => {
  return (
    <div
      className="sticky top-[64px] flex w-52 flex-col justify-between border-r border-border bg-background shadow-md"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Suspense fallback={<LoadingSidebar />}>
        <BoardDetailsSidebarContent boardId={boardId} />
      </Suspense>
    </div>
  );
};

export default BoardDetailsSidebar;
