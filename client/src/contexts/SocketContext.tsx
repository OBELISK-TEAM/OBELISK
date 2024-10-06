import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "sonner";
import SocketLoading from "@/components/loading/SocketLoading";
import { socketEmitJoinBoard, socketEmitLeaveBoard } from "@/lib/board/socketEmitUtils";

interface SocketContextProps {
  totalSlidesNumber: number;
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
  boardId: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, boardId }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [totalSlidesNumber, setTotalSlidesNumber] = useState<number>(1); // TODO: this is temporary; when backend starts to send total number of board slides, decide what to do with this code

  const token = `Bearer ${Cookies.get("accessToken")}`;

  useEffect(() => {
    socketRef.current = io(`http://${process.env.SERVER_HOST}:${process.env.SOCKET_GW_PORT}/gateway`, {
      autoConnect: true,
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    function onError(val: any) {
      toast.error(val.message);
    }
    function onUserJoinedBoard(res: any) {
      toast.info(res.message);
    }
    function onUserLeftBoard(res: any) {
      console.log("lb");

      toast.info(res.message);
    }
    // function onUserJoinedSlide(res: any) {
    //   toast.info(res.message);
    // }
    // function onUserLeftSlide(res: any) {
    //   toast.info(res.message);
    // }

    socketRef.current.on("error", onError);
    socketRef.current.on("joined-board", onUserJoinedBoard);
    socketRef.current.on("left-board", onUserLeftBoard);
    // socketRef.current.on("joined-slide", onUserJoinedSlide);
    // socketRef.current.on("left-slide", onUserLeftSlide);

    function handleJoinBoard(res: any) {
      console.log(JSON.stringify(res));
      toast.success("Joined board " + boardId);
    }

    const joinBoardData = { board: { _id: boardId } };

    setTimeout(() => {
      if (socketRef.current) {
        socketEmitJoinBoard(socketRef.current, joinBoardData, handleJoinBoard);
      }
      setTotalSlidesNumber(9); // TODO: this can't be hardcoded, but has to be for now as backend doesn't provide this info anywhere
      setIsSocketReady(true);
    }, 2000);

    return () => {
      if (!socketRef.current) {
        return;
      }
      socketEmitLeaveBoard(socketRef.current, {});

      socketRef.current.off("error", onError);
      socketRef.current.off("joined-board", onUserJoinedBoard);
      socketRef.current.off("left-board", onUserLeftBoard);
      // socketRef.current.off("joined-slide", onUserJoinedSlide);
      // socketRef.current.off("left-slide", onUserLeftSlide);
      socketRef.current.disconnect();
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
