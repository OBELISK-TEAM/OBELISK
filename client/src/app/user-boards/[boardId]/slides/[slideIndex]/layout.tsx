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
import { useSlides } from "@/contexts/SlidesProvider";
import { socketEmitJoinSlide, socketEmitLeaveSlide } from "@/lib/board/socketEmitUtils";

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
  const { totalSlidesNumber } = useSocket();

  const slideIndexNumber = parseInt(slideIndex);

  useEffect(() => {
    if (!socket) {
      toast.error("Socket not available in slides/[slideIndex]/layout.tsx");
      return;
    }

    const joinSlideData = { slide: { slideNumber: slideIndexNumber } };

    function handleJoinBoard(res: object) {
      // console.log("Received new slide data");
      toast.success("Received new slide data");

      setSlideData(res);
    }

    socketEmitJoinSlide(socket, joinSlideData, handleJoinBoard);

    return () => {
      socketEmitLeaveSlide(socket, {});
    };
  }, [socket, slideIndexNumber]);

  if (isNaN(slideIndexNumber)) {
    return notFound();
  }
  if (slideIndexNumber < 1 || slideIndexNumber > totalSlidesNumber) {
    return notFound();
  }

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
