import React, { useState, useEffect } from "react";
import styles from "./cursors.module.css";
import { Socket } from "socket.io-client";
import { motion } from "framer-motion";
import logger from "@/lib/logger";
import { useSocket } from "@/contexts/SocketContext";

export interface CursorPosition {
  userId: string;
  x: number;
  y: number;
  color: string;
  username: string;
}

interface CursorsProps {
  socket: Socket | null;
  currentUserId: string;
}

const Cursors: React.FC<CursorsProps> = ({ socket, currentUserId }) => {
  const [cursorPositions, setCursorPositions] = useState<CursorPosition[]>([]);
  logger.log("Cursors RE-RENDERING");

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleIncomingCursorMove = (data: CursorPosition) => {
      const { userId, x, y, color, username } = data;

      if (userId === currentUserId) {
        return;
      }

      setCursorPositions((prevCursors) => {
        const otherCursors = prevCursors.filter((cursor) => cursor.userId !== userId);
        return [...otherCursors, { userId, x, y, color, username }];
      });
    };

    const handleCursorRemove = (data: { userId: string }) => {
      const { userId } = data;
      logger.log("Removing cursor", userId);
      setCursorPositions((prevCursors) => {
        return prevCursors.filter((cursor) => cursor.userId !== userId);
      });
    };

    socket.on("cursor-move", handleIncomingCursorMove);
    socket.on("cursor-remove", handleCursorRemove);

    socket.on("disconnect", () => {
      setCursorPositions([]);
    });

    return () => {
      socket.off("cursor-move", handleIncomingCursorMove);
      socket.off("cursor-remove", handleCursorRemove);
    };
  }, [socket, currentUserId]);

  return (
    <>
      {cursorPositions.map((cursor) => (
        <motion.div
          key={cursor.userId}
          className={styles.cursorWrapper}
          animate={{ x: cursor.x, y: cursor.y }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
        >
          <div className={styles.cursorLabel}>{cursor.username}</div>
          <div
            className={styles.cursor}
            style={{
              backgroundColor: cursor.color,
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default React.memo(Cursors);
