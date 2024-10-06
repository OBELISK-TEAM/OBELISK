import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSocket } from "./SocketContext";

interface SlidesContextProps {
  slideIndex: number;
  totalSlidesNumber: number;
  setSlideIndex: (index: number) => void;
  socketEmitAddObject: (addObjectData: any, callback: (res: string) => void) => void;
  socketEmitUpdateObject: (updateObjectData: any) => void;
  socketEmitDeleteObject: (deleteObjectData: any) => void;
}

const SlidesContext = createContext<SlidesContextProps | undefined>(undefined);

interface SlidesProviderProps {
  children: React.ReactNode;
}

export const SlidesProvider: React.FC<SlidesProviderProps> = ({ children }) => {
  const { socket } = useSocket();
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [totalSlidesNumber, setTotalSlidesNumber] = useState<number>(6); // TODO: this is temporary; when backend starts to send total number of board slides, decide what to do with this code

  const socketEmitAddObject = useCallback((addObjectData: any, callback: (res: string) => void) => {
    socket?.emit("add-object", addObjectData, callback);
  }, [socket]);

  const socketEmitUpdateObject = useCallback((updateObjectData: any) => {
    socket?.emit("update-object", updateObjectData);
  }, [socket]);

  const socketEmitDeleteObject = useCallback((deleteObjectData: any) => {
    socket?.emit("delete-object", deleteObjectData);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;


    function onSlideAdded(res: object) {
      console.log(JSON.stringify(res));
    }
    socket.on("slide-added", onSlideAdded);

    function onSlideDeleted(res: object) {
      console.log(JSON.stringify(res));
    }
    socket.on("slide-deleted", onSlideDeleted);


    const joinSlideData = { slide: { slideNumber: slideIndex } };

    function handleJoinSlide(res: any) {
      toast.success("Joined slide " + slideIndex);
    }

    socket.emit("join-slide", joinSlideData, handleJoinSlide);

    return () => {
      socket.off("slide-added", onSlideAdded);
      socket.off("slide-deleted", onSlideDeleted);
      socket.emit("leave-slide", joinSlideData);
    };
  }, [socket, slideIndex]);

  return (
    <SlidesContext.Provider
      value={{
        slideIndex,
        totalSlidesNumber,
        setSlideIndex,
        socketEmitAddObject,
        socketEmitUpdateObject,
        socketEmitDeleteObject,
      }}
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
