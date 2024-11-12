import React from "react";
import { BoardPermissions } from "@/app/user-boards/(board-management)/[boardId]/permissions/_components/BoardPermissions";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { getBoardDetailsData } from "@/services/board/fetchBoardDetails";
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
