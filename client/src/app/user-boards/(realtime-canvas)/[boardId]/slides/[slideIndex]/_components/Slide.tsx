"use client";
import React from "react";
import { useCanvas } from "@/contexts/CanvasContext";
import { useZoom } from "@/contexts/ZoomUIContext";
import { SlideControls } from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_components/slide-controls/SlideControls";
import Cursors from "@/app/user-boards/(realtime-canvas)/[boardId]/slides/[slideIndex]/_components/cursors/Cursors";
import { useSocket } from "@/contexts/SocketContext";

const Slide: React.FC = () => {
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

export default Slide;
