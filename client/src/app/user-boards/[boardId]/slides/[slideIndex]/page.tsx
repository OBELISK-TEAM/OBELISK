import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";
import { notFound } from "next/navigation";
import Board from "@/components/board/Board";
import { fetchBoardData } from "@/services/fetchBoardData";

interface UserBoardPage {
  params: {
    boardId: string;
    slideIndex: string;
  };
}

const SliderPage = async ({ params }: UserBoardPage) => {
  const { boardId, slideIndex } = params;

  const boardData = await fetchBoardData(boardId, slideIndex);

  if (!boardData || !boardData.slides || !boardData.slide?._id) {
    return notFound();
  }

  return (
    <ZoomUIProvider>
      <CanvasProvider boardData={boardData}>
        <UndoRedoProvider slideId={boardData.slide._id}>
          <MenuDataProvider>
            <FileProvider>
              <KeydownListenerWrapper>
                <Board />
              </KeydownListenerWrapper>
            </FileProvider>
          </MenuDataProvider>
        </UndoRedoProvider>
      </CanvasProvider>
    </ZoomUIProvider>
  );
};

export default SliderPage;
