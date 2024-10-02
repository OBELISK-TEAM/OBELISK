"use client";

import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { AddObjectData, DeleteObjectData, JoinBoardData, UpdateObjectData } from "@/interfaces/socket/SocketEmitsData";
import { toast } from "sonner";
import useSocketListeners from "@/hooks/socket/useSocketListeners";
import { useCanvas } from "./CanvasContext";

interface SocketContextProps {
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
  const {
    state: { canvas },
  } = useCanvas();

  const token = Cookies.get("accessToken");

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
    const socketInstance = io(`http://${process.env.SERVER_HOST}:${process.env.SOCKET_GW_PORT}/gateway`, {
      autoConnect: true,
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    socketRef.current = socketInstance;

    function onError(val: any) {
      toast.error(val.message);
    }

    socketInstance.on("error", onError);

    const joinBoardData: JoinBoardData = {
      board: {
        _id: boardId,
      },
    };

    setTimeout(() => {
      socketInstance.emit("join-board", joinBoardData, () => {
        toast.success(`Joined the board ${boardId}`);
      });
    }, 1500);

    return () => {
      socketInstance.emit("leave-board");

      socketInstance.off("error", onError);
      socketInstance.disconnect();
    };
  }, [token, boardId]);

  useSocketListeners(socketRef.current, canvas);

  // Pass the emit functions via context, alongside the socket instance
  return (
    <SocketContext.Provider
      value={{
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

// Custom hook to access the socket and emit functions
export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
