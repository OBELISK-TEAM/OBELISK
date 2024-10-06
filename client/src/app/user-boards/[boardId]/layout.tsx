import React from "react";
import { BoardDetailsSidebar } from "@/components/board-details/BoardDetailsSidebar";
interface LayoutProps {
  children: React.ReactNode;
}
const BoardLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-1">
      <BoardDetailsSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};
export default BoardLayout;
