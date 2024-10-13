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
  const { socket, totalSlides } = useSocket();
  const [slideData, setSlideData] = useState<object>({});
  const [slideId, setSlideId] = useState<string | undefined>(undefined);

  const slideIndexNumber = parseInt(slideIndex);

  useEffect(() => {
    if (!socket) {
      logger.error("Socket not available in slides/[slideIndex]/layout.tsx");
      toast.error("Socket not available in slides/[slideIndex]/layout.tsx");
      return;
    }

    const joinSlideData = { slide: { slideNumber: slideIndexNumber } };

    function handleJoinSlide(res: JoinSlideResponse) {
      setSlideData(res);
      setSlideId(res._id);
    }

    // I. HAVE. ENOUGH.
    setTimeout(() => {
      socketEmitJoinSlide(socket, joinSlideData, handleJoinSlide);
    }, 1000);
  }, [socket, slideIndexNumber]);

  if (isNaN(slideIndexNumber)) {
    return notFound();
  }
  if (slideIndexNumber < 1 || slideIndexNumber > totalSlides) {
    return notFound();
  }

  return (
    <ZoomUIProvider>
      <CanvasProvider slideData={slideData} slideId={slideId} slideNumber={slideIndexNumber} boardId={boardId}>
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
