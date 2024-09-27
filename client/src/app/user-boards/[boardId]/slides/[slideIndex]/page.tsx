import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";
import { notFound } from "next/navigation";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";
import Board from "@/components/board/Board";

interface UserBoardPage {
  params: {
    boardId: string;
    slideIndex: string;
  };
}

const SliderPage = async ({ params }: UserBoardPage) => {
  const { boardId, slideIndex } = params;

  const slideIndexNumber = parseInt(slideIndex);

  if (isNaN(slideIndexNumber)) {
    return notFound();
  }

  let boardResponse: Response;

  try {
    boardResponse = await fetch(
      `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}?slide=${slideIndex}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Error fetching board data:", error);
    return notFound();
  }

  if (!boardResponse.ok) {
    return notFound();
  }

  let boardData: BoardDataResponse;

  try {
    boardData = await boardResponse.json();
  } catch (error) {
    console.error("Error parsing board data:", error);
    return notFound();
  }

  const totalSlides = boardData.slides.length;

  if (slideIndexNumber >= totalSlides || slideIndexNumber < 0) {
    return notFound();
  }

  const slide = boardData.slide;

  if (!slide) {
    return notFound();
  }

  return (
    <ZoomUIProvider>
      <CanvasProvider boardData={boardData}>
        <UndoRedoProvider slideId={slide._id}>
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
