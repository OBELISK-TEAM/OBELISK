import { useState, useEffect } from "react";
import { fabric } from "fabric";

const useColorAndSize = (canvas: fabric.Canvas | null) => {
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.color = color;
      canvas.freeDrawingBrush.width = size;
    }
  }, [color, size]);

  return { color, size, setColor, setSize };
};

export default useColorAndSize;
