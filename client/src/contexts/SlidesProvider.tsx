import React, { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";
import { socketEmitLeaveSlide } from "@/lib/board/socketEmitUtils";
import { SlideAddedResponse, SlideDeletedResponse } from "@/interfaces/socket/SocketCallbacksData";

interface SlidesContextProps {
  // totalSlidesNumber: number;
}

const SlidesContext = createContext<SlidesContextProps | undefined>(undefined);

interface SlidesProviderProps {
  children: React.ReactNode;
}

export const SlidesProvider: React.FC<SlidesProviderProps> = ({ children }) => {
  const { socket, setTotalSlidesNumber, totalSlidesNumber } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onSlideAdded(res: SlideAddedResponse) {
      toast.info("New slide has been added");
      setTotalSlidesNumber(totalSlidesNumber + 1);
    }
    socket.on("slide-added", onSlideAdded);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onSlideDeleted(res: SlideDeletedResponse) {
      toast.info("A slide has been deleted");
      setTotalSlidesNumber(totalSlidesNumber - 1);
    }
    socket.on("slide-deleted", onSlideDeleted);

    return () => {
      socket.off("slide-added", onSlideAdded);
      socket.off("slide-deleted", onSlideDeleted);
      socketEmitLeaveSlide(socket, {});
    };
  }, [socket, totalSlidesNumber, setTotalSlidesNumber]);

  return (
    <SlidesContext.Provider
      value={
        {
          // totalSlidesNumber,
        }
      }
    >
      {children}
    </SlidesContext.Provider>
  );
};

export const useSlides = (): SlidesContextProps => {
  const context = useContext(SlidesContext);
  if (!context) {
    throw new Error("useSlides must be used within a SlidesProvider");
  }
  return context;
};
