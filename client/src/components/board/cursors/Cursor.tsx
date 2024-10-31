import React, { useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./cursors.module.css";
import { getColorFromEmail, getContrastingTextColor, darkenHexColor } from "@/lib/colorUtils";
import { fabric } from "fabric";
import { CursorPosition } from "@/interfaces/responses/cursor/cursor-position-emit";

interface CursorProps {
  cursor: CursorPosition;
  canvas: fabric.Canvas | null;
}

const Cursor: React.FC<CursorProps> = ({ cursor, canvas }) => {
  const color = useMemo(() => getColorFromEmail(cursor.user.email), [cursor.user.email]);

  const textColor = useMemo(() => getContrastingTextColor(color), [color]);

  const cursorColor = useMemo(() => darkenHexColor(color, 20), [color]);
  const cursorTextColor = useMemo(() => getContrastingTextColor(cursorColor), [cursorColor]);

  const { clampedX, clampedY } = useMemo(() => {
    if (!canvas) {
      return { clampedX: 0, clampedY: 0 };
    }

    const transform = canvas.viewportTransform;
    const point = new fabric.Point(cursor.cursorData.x, cursor.cursorData.y);
    const transformedPoint = fabric.util.transformPoint(point, transform as number[]);

    const clampedX = Math.min(Math.max(transformedPoint.x, 0), canvas.getWidth());
    const clampedY = Math.min(Math.max(transformedPoint.y, 0), canvas.getHeight());

    return { clampedX, clampedY };
  }, [canvas, cursor.cursorData.x, cursor.cursorData.y]);

  return (
    <motion.div
      className={styles.cursorWrapper}
      animate={{ x: clampedX, y: clampedY }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <div className={styles.cursorLabel} style={{ backgroundColor: color, color: textColor }}>
        {cursor.user.email}
      </div>
      <div
        className={styles.cursor}
        style={{
          background: cursorColor,
          borderColor: cursorTextColor,
        }}
      />
    </motion.div>
  );
};

export default React.memo(Cursor);
