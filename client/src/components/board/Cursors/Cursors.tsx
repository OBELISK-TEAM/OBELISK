import React, { useState, useEffect } from "react";
import styles from "./cursors.module.css";
import { Socket } from "socket.io-client";
import { motion } from "framer-motion";
import logger from "@/lib/logger";
import { CursorPosition } from "@/interfaces/responses/cursor/cursor-position-emit";
import { BasicUserInfo } from "@/interfaces/socket/SocketCallbacksData";
import { fabric } from "fabric";
import { useCanvas } from "@/contexts/CanvasContext";

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

    const handleIncomingCursorMove = (data: CursorPosition) => {
      const userId = data.user._id;

      if (userId === currentUserId) {
        return;
      }

      setCursorPositions((prevCursors) => {
        const otherCursors = prevCursors.filter((cursor) => cursor.user._id !== userId);
        return [...otherCursors, data];
      });
    };

    const handleCursorRemove = (data: BasicUserInfo) => {
      const { _id: userId } = data;
      logger.log("Removing cursor", userId);
      setCursorPositions((prevCursors) => prevCursors.filter((cursor) => cursor.user._id !== userId));
    };

    socket.on("cursor-moved", handleIncomingCursorMove);
    socket.on("left-slide", handleCursorRemove);

    socket.on("disconnect", () => {
      setCursorPositions([]);
    });

    return () => {
      socket.off("cursor-moved", handleIncomingCursorMove);
      socket.off("left-slide", handleCursorRemove);
    };
  }, [socket, currentUserId]);

  return (
    <>
      {cursorPositions.map((cursor) => {
        if (!canvas) {
          return null;
        }

        const transform = canvas.viewportTransform;
        const point = new fabric.Point(cursor.cursorData.x, cursor.cursorData.y);
        const transformedPoint = fabric.util.transformPoint(point, transform as number[]);

        const clampedX = Math.min(Math.max(transformedPoint.x, 0), canvas.getWidth());
        const clampedY = Math.min(Math.max(transformedPoint.y, 0), canvas.getHeight());

        return (
          <motion.div
            key={cursor.user._id}
            className={styles.cursorWrapper}
            animate={{ x: clampedX, y: clampedY }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
          >
            <div className={styles.cursorLabel}>{cursor.user.email}</div>
            <div
              className={styles.cursor}
              style={{
                backgroundColor: cursor.cursorData.color,
              }}
            />
          </motion.div>
        );
      })}
    </>
  );
};

export default React.memo(Cursors);
