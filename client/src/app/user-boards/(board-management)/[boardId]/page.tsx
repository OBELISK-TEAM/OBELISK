import React from "react";
import BoardDetailsInfo from "@/app/user-boards/(board-management)/[boardId]/_components/BoardDetails";
import { getBoardDetailsData } from "@/services/board/fetchBoardDetails";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import BoardDetailsError from "@/components/error/BoardDetailsError";

interface BoardDetailsPageProps {
  params: {
    boardId: string;
  };
}
const BoardDetailsPage = async ({ params }: BoardDetailsPageProps) => {
  const boardData: BoardDetailsResponse = await getBoardDetailsData(params.boardId);
  return <BoardDetailsInfo board={boardData} />;
};
export default BoardDetailsPage;
