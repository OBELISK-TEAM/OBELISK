"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from 'js-cookie';

interface SocketContextProps {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const token = Cookies.get("accessToken");

  useEffect(() => {
    let socketInstance: Socket | null = null;

    socketInstance = io(`http://${process.env.SERVER_HOST}:${process.env.SOCKET_GW_PORT}/gateway`, {
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    setSocket(socketInstance);

    return () => {
      socketInstance?.disconnect();
    };
  }, [token]);

  const connect = () => {
    socket?.connect();
  };

  const disconnect = () => {
    socket?.disconnect();
  };

  return <SocketContext.Provider value={{ socket, connect, disconnect }}>{children}</SocketContext.Provider>;
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
