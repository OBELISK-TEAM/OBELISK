import React from "react";
import { BoardPermissions } from "@/components/board-details/board-permissions/BoardPermissions";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { getBoardDetailsData } from "@/services/fetchBoardDetails";
interface PermissionsPageProps {
  params: {
    boardId: string;
  };
}
const PermissionsPage = async ({ params }: PermissionsPageProps) => {
  const boardData: BoardDetailsResponse = await getBoardDetailsData(params.boardId);
  return <BoardPermissions board={boardData} />;
};
export default PermissionsPage;
