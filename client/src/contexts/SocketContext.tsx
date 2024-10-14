"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import SocketLoading from "@/components/loading/SocketLoading";
import { socketEmitJoinBoard } from "@/lib/board/socketEmitUtils";
import { JoinBoardResponse } from "@/interfaces/socket/SocketCallbacksData";

interface SocketContextProps {
  totalSlides: number;
  socket: Socket | null;
  setTotalSlides: React.Dispatch<React.SetStateAction<number>>;
  boardId: string | undefined;
  boardName: string | undefined;
  boardOwner: string | undefined;
  currentPermission: string | undefined;
  isBoardJoined: boolean;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
  boardId: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, boardId }) => {
  const token = `Bearer ${Cookies.get("accessToken")}`;
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    socketRef.current = io(`http://${process.env.SERVER_HOST}:${process.env.SOCKET_GW_PORT}/gateway`, {
      autoConnect: true,
      transports: ["websocket"],
      auth: {
        token,
      },
    });
  }

  const [isSocketReady, setIsSocketReady] = useState(false);
  const [totalSlides, setTotalSlides] = useState<number>(100);
  const [boardName, setBoardName] = useState<string | undefined>(undefined);
  const [currentPermission, setCurrentPermission] = useState<string | undefined>(undefined);
  const [boardOwner, setBoardOwner] = useState<string | undefined>(undefined);
  const [isBoardJoined, setIsBoardJoined] = useState(false);

  useEffect(() => {
    function onError(val: any) {
      toast.error(val.message);
    }
    function onUserJoinedBoard(res: any) {
      toast.info(res.message);
    }
    function onUserLeftBoard(res: any) {
      toast.info(res.message);
    }
    function onUserJoinedSlide(res: any) {
      toast.info(res.message);
    }
    function onUserLeftSlide(res: any) {
      toast.info(res.message);
    }
    const socket = socketRef.current;
    socket?.on("error", onError);
    socket?.on("joined-board", onUserJoinedBoard);
    socket?.on("left-board", onUserLeftBoard);
    socket?.on("joined-slide", onUserJoinedSlide);
    socket?.on("left-slide", onUserLeftSlide);

    const joinBoardData = { board: { _id: boardId } };

    // I. HAVE. ENOUGH.
    setTimeout(() => {
      if (socket) {
        socketEmitJoinBoard(socket, joinBoardData, handleJoinBoard);
      }
      setIsSocketReady(true);
    }, 2000);

    return () => {
      if (!socket) {
        return;
      }
      socket.off("error", onError);
      socket.off("joined-board", onUserJoinedBoard);
      socket.off("left-board", onUserLeftBoard);
      socket.off("joined-slide", onUserJoinedSlide);
      socket.off("left-slide", onUserLeftSlide);

      //socketEmitLeaveBoard(socket, {});
      //socketRef.current.disconnect();
    };
  }, [token, boardId]);

  if (!isSocketReady) {
    return <SocketLoading />;
  }

  function handleJoinBoard(res: JoinBoardResponse) {
    setTotalSlides(res.slidesCount);
    setBoardName(res.name);
    setCurrentPermission(res.permission);
    setBoardOwner(res.owner);
    setIsBoardJoined(true);
    toast.success("Joined board " + boardId);
  }

  return (
    <SocketContext.Provider
      value={{
        totalSlides,
        socket: socketRef.current,
        setTotalSlides,
        boardName,
        boardOwner,
        boardId,
        currentPermission,
        isBoardJoined,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
