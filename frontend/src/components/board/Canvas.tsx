"use client";
import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import { useZoom } from "@/contexts/ZoomUIContext";

const SlideCanvas: React.FC = () => {
  const { canvasRef } = useCanvas();
  const { zoomValue, showZoomBadge } = useZoom();

  return (
    <div className="mt-4 flex w-fit rounded-lg bg-white">
      <canvas
        ref={canvasRef}
        className="rounded-lg border"
        width={1000}
        height={550}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className={`zoom-badge ${showZoomBadge ? "show" : "hide"}`}>Zoom: {zoomValue.toFixed(2)}%</div>
    </div>
  );
};

export default SlideCanvas;
