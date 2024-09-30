"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { JoinBoardData } from "@/interfaces/socket/SocketEmitsData";
import { toast } from "sonner";
import useSocketListeners from "@/hooks/socket/useSocketListeners";
import { useCanvas } from "./CanvasContext";

interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
  boardId: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, boardId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {
    state: { canvas },
  } = useCanvas();

  const token = Cookies.get("accessToken");

  useEffect(() => {
    let socketInstance: Socket | null = null;

    socketInstance = io(`http://${process.env.SERVER_HOST}:${process.env.SOCKET_GW_PORT}/gateway`, {
      autoConnect: true,
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    setSocket(socketInstance);

    function onError(val: any) {
      toast.error(val.message);
    }

    socketInstance.on("error", onError);

    const joinBoardData: JoinBoardData = {
      board: {
        _id: boardId,
      },
    };

    // Temporary solution, otherwsie joining the board *sometimes* doesn't work. Whatthe heck is going on
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

  useSocketListeners(socket, canvas);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
