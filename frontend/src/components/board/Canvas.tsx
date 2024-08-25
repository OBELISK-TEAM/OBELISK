"use client";
import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";

const SlideCanvas: React.FC = () => {
  const { canvasRef } = useCanvas();
  return (
    <div className="mt-4 flex w-fit rounded-lg bg-white">
      <canvas
        ref={canvasRef}
        className="rounded-lg border"
        width={1000}
        height={550}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default SlideCanvas;
