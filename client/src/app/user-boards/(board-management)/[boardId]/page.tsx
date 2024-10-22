import React from "react";
import BoardDetailsInfo from "@/components/board-details/board-information/BoardDetails";
import { getBoardDetailsData } from "@/services/fetchBoardDetails";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";

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
