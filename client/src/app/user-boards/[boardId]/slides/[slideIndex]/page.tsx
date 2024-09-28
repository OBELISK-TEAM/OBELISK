"use client";
import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";
import { notFound } from "next/navigation";
import Board from "@/components/board/Board";
import { defaultBoardData } from "@/data/default-board-data";
import { useBoardData } from "@/hooks/board/useBoardData";
import { useEffect } from "react";
import LoadingBoard from "@/app/user-boards/[boardId]/loading";
import { useBoardDataContext } from "@/contexts/BoardDataContext";

interface UserBoardPage {
  params: {
    boardId: string;
    slideIndex: string;
  };
}

const BoardPage = ({ params }: UserBoardPage) => {
  const { boardId, slideIndex } = params;
  const { data: fetchedBoardData, isLoading, isError, mutateBoardData } = useBoardData(boardId, slideIndex);
  const { boardData, setBoardData } = useBoardDataContext();

  useEffect(() => {
    if (fetchedBoardData) {
      setBoardData(fetchedBoardData);
    }
  }, [fetchedBoardData, setBoardData]);

  const boardDataResponse = fetchedBoardData || boardData;
  const slideId = boardDataResponse?.slide?._id;
  if (isError || !slideId) {
    return notFound();
  }
  console.log("boardDataResponse_id:", boardDataResponse._id);
  console.log("isLoading:", isLoading);
  if (isLoading && boardDataResponse._id === "-1") {
    return <LoadingBoard />;
  }
  return (
    <ZoomUIProvider>
      <CanvasProvider boardData={boardDataResponse} mutateBoardData={mutateBoardData}>
        <UndoRedoProvider slideId={slideId}>
          <MenuDataProvider>
            <FileProvider>
              <KeydownListenerWrapper>
                <Board isLoading={isLoading} />
              </KeydownListenerWrapper>
            </FileProvider>
          </MenuDataProvider>
        </UndoRedoProvider>
      </CanvasProvider>
    </ZoomUIProvider>
  );
};

export default BoardPage;
