import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import SocketLoading from "@/components/loading/SocketLoading";
import { socketEmitJoinBoard } from "@/lib/board/socketEmitUtils";
import { JoinBoardResponse } from "@/interfaces/socket/SocketCallbacksData";

interface SocketContextProps {
  totalSlidesNumber: number;
  socket: Socket | null;
  setTotalSlidesNumber: React.Dispatch<React.SetStateAction<number>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
  boardId: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, boardId }) => {
  const token = `Bearer ${Cookies.get("accessToken")}`;
  const socketRef = useRef<Socket>(io(`http://${process.env.SERVER_HOST}:${process.env.SOCKET_GW_PORT}/gateway`, {
    autoConnect: true,
    transports: ["websocket"],
    auth: {
      token,
    },
  }));
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [totalSlidesNumber, setTotalSlidesNumber] = useState<number>(100);
  // const [boardName, setBoardName] = useState<string>(undefined)
  // const [userPermission, setUserPermission] = useSocket<string>(undefined);

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

    socketRef.current.on("error", onError);
    socketRef.current.on("joined-board", onUserJoinedBoard);
    socketRef.current.on("left-board", onUserLeftBoard);
    socketRef.current.on("joined-slide", onUserJoinedSlide);
    socketRef.current.on("left-slide", onUserLeftSlide);

    function handleJoinBoard(res: JoinBoardResponse) {
      setTotalSlidesNumber(res.slidesCount);
      toast.success("Joined board " + boardId);
    }

    const joinBoardData = { board: { _id: boardId } };

    // I. HAVE. ENOUGH.
    setTimeout(() => {
      if (socketRef.current) {
        socketEmitJoinBoard(socketRef.current, joinBoardData, handleJoinBoard);
      }
      setIsSocketReady(true);
    }, 2000);

    return () => {
      if (!socketRef.current) {
        return;
      }
      socketRef.current.off("error", onError);
      socketRef.current.off("joined-board", onUserJoinedBoard);
      socketRef.current.off("left-board", onUserLeftBoard);
      socketRef.current.off("joined-slide", onUserJoinedSlide);
      socketRef.current.off("left-slide", onUserLeftSlide);

      // socketEmitLeaveBoard(socketRef.current, {});
      // socketRef.current.disconnect();
    };
  }, [token, boardId]);

  if (!isSocketReady) {
    return <SocketLoading />;
  }

  return (
    <SocketContext.Provider
      value={{
        totalSlidesNumber,
        socket: socketRef.current,
        setTotalSlidesNumber: setTotalSlidesNumber
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
