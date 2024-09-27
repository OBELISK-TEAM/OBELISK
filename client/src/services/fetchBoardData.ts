import { BoardDataResponse } from "@/interfaces/responses/board-data-response";

export const fetchBoardData = async (boardId: string, slideIndex: string): Promise<BoardDataResponse | null> => {
  const slideIndexNumber = parseInt(slideIndex);

  if (isNaN(slideIndexNumber)) {
    return null;
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
    return null;
  }

  if (!boardResponse.ok) {
    return null;
  }

  let boardData: BoardDataResponse;

  try {
    boardData = await boardResponse.json();
  } catch (error) {
    console.error("Error parsing board data:", error);
    return null;
  }

  const totalSlides = boardData.slides.length;

  if (slideIndexNumber >= totalSlides || slideIndexNumber < 0 || !boardData.slide) {
    return null;
  }

  return boardData;
};
