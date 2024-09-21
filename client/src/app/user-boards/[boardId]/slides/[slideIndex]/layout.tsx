import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";
import { notFound } from "next/navigation";
import { BoardDataResponse } from "@/interfaces/responses/board-data-response";

interface UserBoardLayout {
  children: React.ReactNode;
  params: {
    boardId: string;
    slideIndex: string;
  };
}

const SliderLayout = async ({ children, params }: UserBoardLayout) => {
  const { boardId, slideIndex } = params;

  if (isNaN(parseInt(slideIndex))) {
    return notFound();
  }
  try {
    const boardResponse = await fetch(
      `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}?slide=${slideIndex}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!boardResponse.ok) {
      return notFound();
    }

    const boardData: BoardDataResponse = await boardResponse.json();
    const length = boardData.slides.length;
    if (parseInt(slideIndex) >= length || parseInt(slideIndex) < 0) {
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
                <KeydownListenerWrapper>{children}</KeydownListenerWrapper>
              </FileProvider>
            </MenuDataProvider>
          </UndoRedoProvider>
        </CanvasProvider>
      </ZoomUIProvider>
    );
  } catch (error) {
    console.error("Error in SliderLayout:", error);
    return notFound();
  }
};

export default SliderLayout;
