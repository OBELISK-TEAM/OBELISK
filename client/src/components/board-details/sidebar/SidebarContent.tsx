import React from "react";
import SidebarContentClient from "./SidebarContentClient";
import { getBoardDetailsData } from "@/services/board/fetchBoardDetails";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import logger from "@/lib/logger";

interface SidebarContentProps {
  boardId: string;
}

const SidebarContent: React.FC<SidebarContentProps> = async ({ boardId }) => {
  let boardData: BoardDetailsResponse | undefined;
  try {
    boardData = await getBoardDetailsData(boardId);
  } catch (error: any) {
    logger.log("Error while fetching board details in generate metadata:", error);
  }
  return <SidebarContentClient boardData={boardData} />;
};

export default SidebarContent;
