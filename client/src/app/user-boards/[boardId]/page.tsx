import React from "react";
import BoardDetailsInfo from "@/components/board-details/board-information/BoardDetailsInfo";

interface BoardDetailsPageProps {
  params: {
    boardId: string;
  };
}
const BoardDetailsPage = ({ params }: BoardDetailsPageProps) => {
  return <BoardDetailsInfo boardId={params.boardId} />;
};
export default BoardDetailsPage;
