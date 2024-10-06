"use client";

import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
// import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";
import { notFound } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { BoardDataResponse } from "@/interfaces/responses/board-data-response";
// import useSocket from "@/hooks/socket/useSocket";
// import { SocketProvider } from "@/contexts/SocketContext";

interface UserBoardLayout {
  children: React.ReactNode;
  params: {
    boardId: string;
    slideIndex: string;
  };
}

const SliderLayout = ({ children, params }: UserBoardLayout) => {
  const { slideIndex, boardId } = params;
  const [slideData, setSlideData] = useState<object>({});
  const { socket } = useSocket();
  const slideIndexNumber = parseInt(slideIndex);

  useEffect(() => {
    if (!socket) {
      // console.log("Socket not available in slides/[slideIndex]/layout.tsx");
      toast.error("Socket not available in slides/[slideIndex]/layout.tsx");
      return;
    }

    const joinSlideData = { slide: { slideNumber: slideIndexNumber } };

    function handleJoinBoard(res: object) {
      // console.log("Received new slide data");
      toast.success("Received new slide data");

      setSlideData(res);
    }

    socket.emit("join-slide", joinSlideData, handleJoinBoard);

    return () => {
      socket.emit("leave-board");
    };
  }, [socket, slideIndexNumber]);

  if (isNaN(slideIndexNumber)) {
    return notFound();
  }

  // let boardResponse: Response;

  // try {
  //   boardResponse = await fetch(
  //     `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/boards/${boardId}?slide=${slideIndex}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       cache: "no-store",
  //     }
  //   );
  // } catch (error) {
  //   console.error("Error fetching board data:", error);
  //   return notFound();
  // }

  // if (!boardResponse.ok) {
  //   return notFound();
  // }

  // let boardData: BoardDataResponse;

  // try {
  //   boardData = await boardResponse.json();
  // } catch (error) {
  //   console.error("Error parsing board data:", error);
  //   return notFound();
  // }

  // const totalSlides = boardData.slides.length;

  // if (slideIndexNumber >= totalSlides || slideIndexNumber < 0) {
  //   return notFound();
  // }

  // const slide = boardData.slide;

  // if (!slide) {
  //   return notFound();
  // }

  return (
    <ZoomUIProvider>
      <CanvasProvider slideData={slideData} slideNumber={slideIndexNumber} boardId={boardId}>
        {/* <UndoRedoProvider slideId={slide._id}> */}
        <MenuDataProvider>
          <FileProvider>
            <KeydownListenerWrapper>{children}</KeydownListenerWrapper>
          </FileProvider>
        </MenuDataProvider>
        {/* </UndoRedoProvider> */}
      </CanvasProvider>
    </ZoomUIProvider>
  );
};

export default SliderLayout;
