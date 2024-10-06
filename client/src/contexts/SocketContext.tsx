import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { AddObjectData, DeleteObjectData, UpdateObjectData } from "@/interfaces/socket/SocketEmitsData";
import { toast } from "sonner";
import SocketLoading from "@/components/loading/SocketLoading";

interface SocketContextProps {
  totalSlidesNumber: number;
  socket: Socket | null;
  socketEmitAddObject: (addObjectData: AddObjectData, callback: (res: string) => void) => void;
  socketEmitUpdateObject: (updateObjectData: UpdateObjectData) => void;
  socketEmitDeleteObject: (deleteObjectData: DeleteObjectData) => void;
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

  // Define socket emit functions here
  const socketEmitAddObject = useCallback((addObjectData: AddObjectData, callback: (res: string) => void) => {
    socketRef.current?.emit("add-object", addObjectData, callback);
  }, []);

  const socketEmitUpdateObject = useCallback((updateObjectData: UpdateObjectData) => {
    socketRef.current?.emit("update-object", updateObjectData);
  }, []);

  const socketEmitDeleteObject = useCallback((deleteObjectData: DeleteObjectData) => {
    socketRef.current?.emit("delete-object", deleteObjectData);
  }, []);

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
    socketRef.current.on("error", onError);

    function onUserJoinedBoard(res: any) {
      toast.info(res.message);
    }
    socketRef.current.on("joined-board", onUserJoinedBoard);

    function onUserLeftBoard(res: any) {
      toast.info(res.message);
    }
    socketRef.current.on("left-board", onUserLeftBoard);

    function handleJoinBoard(res: any) {
      console.log(JSON.stringify(res));
      toast.success("Joined board " + boardId);
    }

    const joinBoardData = { board: { _id: boardId } };

    setTimeout(() => {
      socketRef.current?.emit("join-board", joinBoardData, handleJoinBoard);
      setTotalSlidesNumber(6); // TODO: this can't be hardcoded, but has to be for now as backend doesn't provide this info anywhere
      setIsSocketReady(true);
    }, 2000);

    return () => {
      socketRef.current?.emit("leave-board");

      socketRef.current?.off("error", onError);
      socketRef.current?.off("joined-board", onUserJoinedBoard);
      socketRef.current?.off("left-board", onUserLeftBoard);
      socketRef.current?.disconnect();
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
        socketEmitAddObject,
        socketEmitUpdateObject,
        socketEmitDeleteObject,
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
