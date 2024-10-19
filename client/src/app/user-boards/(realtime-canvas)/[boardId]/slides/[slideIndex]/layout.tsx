"use client";

import { MenuDataProvider } from "@/contexts/MenuDataContext";
import { FileProvider } from "@/contexts/FileContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import KeydownListenerWrapper from "@/providers/KeydownListenerWrapper";
import { ZoomUIProvider } from "@/contexts/ZoomUIContext";
import { notFound } from "next/navigation";
import { useSocket } from "@/contexts/SocketContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { socketEmitJoinSlide } from "@/lib/board/socketEmitUtils";
import { JoinSlideResponse } from "@/interfaces/socket/SocketCallbacksData";
import logger from "@/lib/logger";

interface UserBoardLayout {
  children: React.ReactNode;
  params: {
    boardId: string;
    slideIndex: string;
  };
}

const SliderLayout = ({ children, params }: UserBoardLayout) => {
  const { slideIndex, boardId } = params;
  const { socket, totalSlides, isBoardJoined, firstSlideChanged, setFirstSlideChanged } = useSocket();
  const [slideData, setSlideData] = useState<JoinSlideResponse | null>(null);

  const slideIndexAsNumber = parseInt(slideIndex);

  useEffect(() => {
    if (!socket) {
      logger.error("Socket not available in slides/[slideIndex]/layout.tsx");
      toast.error("Socket not available in slides/[slideIndex]/layout.tsx");
      return;
    }

    const joinSlideData = { slide: { slideNumber: slideIndexAsNumber } };

    function handleJoinSlide(res: JoinSlideResponse) {
      logger.log("Joined slide", res);
      setSlideData(res);
    }

    if (isBoardJoined || firstSlideChanged) {
      if (firstSlideChanged) {
        setFirstSlideChanged(false);
      }
      socketEmitJoinSlide(socket, joinSlideData, handleJoinSlide);
    }
  }, [socket, slideIndexAsNumber, isBoardJoined, firstSlideChanged, setFirstSlideChanged]);

  if (isNaN(slideIndexAsNumber)) {
    return notFound();
  }
  if (slideIndexAsNumber < 1 || slideIndexAsNumber > totalSlides) {
    return notFound();
  }

  return (
    <ZoomUIProvider>
      <CanvasProvider slideData={slideData} slideId={slideData?._id} slideIndex={slideIndexAsNumber} boardId={boardId}>
        <UndoRedoProvider>
          <MenuDataProvider>
            <FileProvider>
              <KeydownListenerWrapper>{children}</KeydownListenerWrapper>
            </FileProvider>
          </MenuDataProvider>
        </UndoRedoProvider>
      </CanvasProvider>
    </ZoomUIProvider>
  );
};

export default SliderLayout;
