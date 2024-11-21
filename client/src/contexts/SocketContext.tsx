"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import SocketLoading from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_loading/SocketLoading";
import { socketEmitJoinBoard } from "@/lib/board/socketEmitUtils";
import { BasicUserInfo, JoinBoardResponse, SimpleMessage } from "@/interfaces/socket/SocketCallbacksData";
import logger from "@/lib/logger";
import { getSocket } from "@/services/socketService";
import { BoardError } from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_error/BoardError";
import { getUserCapabilities } from "@/lib/permissionUtils";
import { UserCapabilities } from "@/interfaces/user-capabilities";
import { useAuth } from "@/contexts/AuthContext";

interface SocketContextProps {
  totalSlides: number;
  socket: Socket | null;
  setTotalSlides: React.Dispatch<React.SetStateAction<number>>;
  boardId: string | undefined;
  boardName: string | undefined;
  boardOwner: string | undefined;
  userCapabilities: UserCapabilities;
  isBoardJoined: boolean;
  firstSlideChanged: boolean;
  setFirstSlideChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
  boardId: string;
  token: string | undefined;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, boardId, token }) => {
  const { userInfo } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const [totalSlides, setTotalSlides] = useState<number>(100);
  const [boardName, setBoardName] = useState<string | undefined>(undefined);
  const [userCapabilities, setUserCapabilities] = useState<UserCapabilities>(getUserCapabilities(undefined));
  const [boardOwner, setBoardOwner] = useState<string | undefined>(undefined);
  const [isBoardJoined, setIsBoardJoined] = useState(false);
  const [firstSlideChanged, setFirstSlideChanged] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  useEffect(() => {
    if (!socketRef.current && token) {
      socketRef.current = getSocket(socketRef.current, token);
    }

    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    function handleJoinBoard(res: JoinBoardResponse) {
      setTotalSlides(res.slideCount);
      setBoardName(res.name);
      setUserCapabilities(getUserCapabilities(res.permission));
      setBoardOwner(res.owner);
      setIsBoardJoined(true);
      setConnectionError(false);
      setIsSocketReady(true);
      toast.success("Joined board " + boardId);
    }

    function onError(val: any) {
      toast.error(val.message);
    }
    function onUserJoinedBoard(res: BasicUserInfo) {
      toast.info(`User ${res.email} has joined this board`);
    }
    function onUserLeftBoard(res: BasicUserInfo) {
      toast.info(`User ${res.email} has left this board`);
    }
    function onUserJoinedSlide(res: BasicUserInfo) {
      // toast.info(`User ${res.email} has joined this slide`);
      logger.log(`User ${res.email} has joined this slide`);
    }
    function onUserLeftSlide(res: BasicUserInfo) {
      // toast.info(`User ${res.email} has left this slide`);
      logger.log(`User ${res.email} has left this slide`);
    }

    function onAuthSuccess(res: SimpleMessage) {
      toast.info(res.message);
      joinBoard();
    }

    function onConnectError() {
      toast.dismiss();
      toast.error("Connection error");
      logger.error("Connection error");
      setConnectionError(true);
    }

    function onReconnectAttempt() {
      toast.dismiss();
      toast.info("Reconnecting...");
      logger.log("Reconnecting...");
    }

    function joinBoard() {
      if (!socket || !boardId) {
        toast.error("No socket");
        logger.error("No socket defined");
        return;
      }
      socketEmitJoinBoard(socket, joinBoardData, handleJoinBoard);
    }

    const handlers = [
      { eventName: "error", handler: onError },
      { eventName: "joined-board", handler: onUserJoinedBoard },
      { eventName: "left-board", handler: onUserLeftBoard },
      { eventName: "joined-slide", handler: onUserJoinedSlide },
      { eventName: "left-slide", handler: onUserLeftSlide },
      { eventName: "auth-success", handler: onAuthSuccess },
      { eventName: "connect_error", handler: onConnectError },
      { eventName: "reconnect_attempt", handler: onReconnectAttempt },
    ];

    handlers.forEach(({ eventName, handler }) => {
      socket.on(eventName, handler);
    });

    const joinBoardData = { board: { _id: boardId } };

    return () => {
      if (!socket) {
        return;
      }
      handlers.forEach(({ eventName, handler }) => {
        socket.off(eventName, handler);
      });

      socketRef?.current?.disconnect();
      socketRef.current = null;
    };
  }, [userInfo, boardId, token]);

  if (connectionError) {
    return <BoardError />;
  }

  if (!isSocketReady) {
    return <SocketLoading />;
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
        userCapabilities,
        isBoardJoined,
        firstSlideChanged,
        setFirstSlideChanged,
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
