"use client";
import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import { useZoom } from "@/contexts/ZoomUIContext";
import { SlideControls } from "@/components/board/SlideControls/SlideControls";
import Cursors from "@/components/board/Cursors/Cursors";
import { useSocket } from "@/contexts/SocketContext";

const SlideCanvas: React.FC = () => {
  const { canvasRef } = useCanvas();
  const { zoomValue, showZoomBadge } = useZoom();
  const { socket } = useSocket();
  return (
    <div className="flex flex-col">
      <div className="relative mt-4 flex w-fit rounded-lg bg-white">
        <canvas
          ref={canvasRef}
          className="rounded-lg border"
          width={1200}
          height={550}
          onContextMenu={(e) => e.preventDefault()}
        />
        <Cursors currentUserId={socket?.id ?? ""} socket={socket} />
        <div className={`zoom-badge ${showZoomBadge ? "show" : "hide"}`}>Zoom: {zoomValue.toFixed(2)}%</div>
      </div>
      <SlideControls />
    </div>
  );
};

export default SlideCanvas;
