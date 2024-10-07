import React from "react";
import BoardDetails from "@/components/board-details/board-information/BoardDetails";

interface BoardDetailsPageProps {
  params: {
    boardId: string;
  };
}
const BoardDetailsPage = ({ params }: BoardDetailsPageProps) => {
  return <BoardDetails boardId={params.boardId} />;
};
export default BoardDetailsPage;
