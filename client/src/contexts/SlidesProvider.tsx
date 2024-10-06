import React, { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";
import { socketEmitLeaveSlide } from "@/lib/board/socketEmitUtils";

interface SlidesContextProps {
  // totalSlidesNumber: number;
}

const SlidesContext = createContext<SlidesContextProps | undefined>(undefined);

interface SlidesProviderProps {
  children: React.ReactNode;
}

export const SlidesProvider: React.FC<SlidesProviderProps> = ({ children }) => {
  const { socket } = useSocket();
  // const [totalSlidesNumber] = useState<number>(9); // TODO: this is temporary; when backend starts to send total number of board slides, decide what to do with this code

  useEffect(() => {
    if (!socket) {
      return;
    }

    function onSlideAdded(res: object) {
      console.log(JSON.stringify(res));
      toast.info("New slide has been added");
    }
    socket.on("slide-added", onSlideAdded);

    function onSlideDeleted(res: object) {
      console.log(JSON.stringify(res));
      toast.info("A slide has been deleted");
    }
    socket.on("slide-deleted", onSlideDeleted);

    return () => {
      socket.off("slide-added", onSlideAdded);
      socket.off("slide-deleted", onSlideDeleted);
      socketEmitLeaveSlide(socket, {});
    };
  }, [socket]);

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
