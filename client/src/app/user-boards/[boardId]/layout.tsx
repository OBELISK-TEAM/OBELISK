import React, { FC } from "react";
import BoardSidebar from "@/components/board-details/BoardSidebar";

interface LayoutProps {
  children: React.ReactNode;
  params: { boardId: string };
}
const BoardLayout: FC<LayoutProps> = ({ children, params: { boardId } }) => {
  return (
    <div className="flex flex-1">
      <BoardSidebar boardId={boardId} />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};
export default BoardLayout;
