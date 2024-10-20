import React, { FC } from "react";
import BoardSidebar from "@/components/board-details/BoardSidebar";
import { Metadata } from "next";
import { getBoardDetailsData } from "@/services/fetchBoardDetails";

interface LayoutProps {
  children: React.ReactNode;
  params: { boardId: string };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { boardId } = params;
  try {
    const boardData = await getBoardDetailsData(boardId);
    return {
      title: `${boardData.name} | Obelisk`,
    };
  } catch (error) {
    console.error("Error while fetching board details in generate metadata:", error);
    return {
      title: `Board details | Obelisk`,
    };
  }
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
