import React, { useState, useEffect } from "react";
import { throttle } from "lodash";
import { Socket } from "socket.io-client";
import logger from "@/lib/logger";
import { CursorPosition } from "@/interfaces/responses/cursor/cursor-position-emit";
import { BasicUserInfo } from "@/interfaces/socket/SocketCallbacksData";
import { useCanvas } from "@/contexts/CanvasContext";
import Cursor from "./Cursor";
import { getColorFromEmail } from "@/lib/colorUtils";

interface CursorsProps {
  socket: Socket | null;
  currentUserId: string;
}

const Cursors: React.FC<CursorsProps> = ({ socket, currentUserId }) => {
  const [cursorPositions, setCursorPositions] = useState<CursorPosition[]>([]);
  const { state } = useCanvas();

  const canvas = state.canvas;

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleIncomingCursorMove = throttle((data: CursorPosition) => {
      const userId = data.user._id;

      if (userId === currentUserId) {
        return;
      }

      setCursorPositions((prevCursors) => {
        const otherCursors = prevCursors.filter((cursor) => cursor.user._id !== userId);
        return [...otherCursors, data];
      });
    }, 200);

    const handleCursorJoin = (data: BasicUserInfo) => {
      const { _id: userId } = data;
      const cursor = {
        user: data,
        cursorData: {
          x: 0,
          y: 0,
          color: getColorFromEmail(data.email),
        },
      };
      setCursorPositions((prevCursors) => {
        const otherCursors = prevCursors.filter((cursor) => cursor.user._id !== userId);
        return [...otherCursors, cursor];
      });
    };

    const handleCursorRemove = (data: BasicUserInfo) => {
      const { _id: userId } = data;
      logger.log("Removing cursor", userId);
      setCursorPositions((prevCursors) => prevCursors.filter((cursor) => cursor.user._id !== userId));
    };

    const handleClearCursors = () => {
      setCursorPositions([]);
    };

    socket.on("cursor-moved", handleIncomingCursorMove);
    socket.on("left-slide", handleCursorRemove);
    socket.on("joined-slide", handleCursorJoin);
    socket.on("disconnect", handleClearCursors);

    return () => {
      socket.off("cursor-moved", handleIncomingCursorMove);
      socket.off("left-slide", handleCursorRemove);
      socket.off("disconnect", handleClearCursors);
      handleClearCursors();
    };
  }, [socket, currentUserId]);

  return (
    <>
      {cursorPositions.map((cursor) => (
        <Cursor key={cursor.user._id} cursor={cursor} canvas={canvas} />
      ))}
    </>
  );
};

export default React.memo(Cursors);
