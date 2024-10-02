"use client";
import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import { useZoom } from "@/contexts/ZoomUIContext";
import { SlideControls } from "@/components/board/SlideControls/SlideControls";

const SlideCanvas: React.FC = () => {
  const { canvasRef } = useCanvas();
  const { zoomValue, showZoomBadge } = useZoom();
  return (
    <div className="flex flex-col">
      <div className="mt-4 flex w-fit rounded-lg bg-white">
        <canvas
          ref={canvasRef}
          className="rounded-lg border"
          width={1200}
          height={550}
          onContextMenu={(e) => e.preventDefault()}
        />

        <div className={`zoom-badge ${showZoomBadge ? "show" : "hide"}`}>Zoom: {zoomValue.toFixed(2)}%</div>
      </div>
      <SlideControls />
    </div>
  );
};

export default SlideCanvas;
