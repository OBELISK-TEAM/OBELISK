import React from "react";
import BoardDetailsInfo from "@/components/board-details/board-information/BoardDetails";
import { getBoardDetailsData } from "@/services/fetchBoardDetails";
import { BoardHeader } from "@/components/user-boards/BoardHeader";
import { ApiError } from "@/errors/ApiError";

interface BoardDetailsPageProps {
  params: {
    boardId: string;
  };
}
const BoardDetailsPage = async ({ params }: BoardDetailsPageProps) => {
  let boardData;
  try {
    boardData = await getBoardDetailsData(params.boardId);
  } catch (error: any) {
    return (
      <section className="rounded-lg border border-error-border bg-card p-6 shadow">
        <BoardHeader title="Board Details" description="Board Information" />
        <p className="text-error-foreground">{error.message}</p>
      </section>
    );
  }

  return <BoardDetailsInfo board={boardData} />;
};
export default BoardDetailsPage;
