"use client";
import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import { useZoom } from "@/contexts/ZoomUIContext";
import { LoadingSpinner } from "@/components/loading/loading-spinner";

const SlideCanvas: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const { canvasRef } = useCanvas();
  const { zoomValue, showZoomBadge } = useZoom();
  return (
    <div className="relative mt-4 flex w-fit rounded-lg bg-white">
      <canvas
        ref={canvasRef}
        className="rounded-lg border"
        width={1200}
        height={550}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className={`zoom-badge ${showZoomBadge ? "show" : "hide"}`}>Zoom: {zoomValue.toFixed(2)}%</div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50">
          <LoadingSpinner className="h-12 w-12 text-white" />
        </div>
      )}
    </div>
  );
};

export default SlideCanvas;
