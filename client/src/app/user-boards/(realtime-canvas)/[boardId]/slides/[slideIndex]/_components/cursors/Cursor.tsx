import React, { useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./cursors.module.css";
import { getColorFromEmail, darkerColor } from "@/lib/colorUtils";
import { fabric } from "fabric";
import { CursorPosition } from "@/interfaces/responses/cursor/cursor-position-emit";

interface CursorProps {
  cursor: CursorPosition;
  canvas: fabric.Canvas | null;
}

export const Cursor: React.FC<CursorProps> = ({ cursor, canvas }) => {
  const color = useMemo(() => getColorFromEmail(cursor.user.email), [cursor.user.email]);

  const cursorColor = useMemo(() => darkerColor(color, 20), [color]);

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
      className={styles.cursorWrapper}
      animate={{ x: clampedX, y: clampedY }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <div className={styles.cursorLabel} style={{ backgroundColor: color }}>
        {cursor.user.email}
      </div>
      <div
        className={styles.cursor}
        style={{
          background: cursorColor,
          borderColor: cursorColor,
        }}
      />
    </motion.div>
  );
};
