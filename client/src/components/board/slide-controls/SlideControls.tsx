"use client";
import React from "react";
import { SlidePagination } from "@/components/board/slide-controls/SlidePagination";
import { SlideActions } from "@/components/board/slide-controls/SlideActions";
import { SlideControlsProvider } from "@/contexts/SlideControlsContext";
import { useSocket } from "@/contexts/SocketContext";

export function SlideControls() {
  const {
    currentPermission: { canControlSlide },
  } = useSocket();
  const emptySpace = <div className="flex flex-grow items-center"></div>;
  return (
    <SlideControlsProvider>
      <div className="flex items-center justify-between border-t p-2">
        {emptySpace}
        <SlidePagination />
        {canControlSlide ? <SlideActions /> : emptySpace}
      </div>
    </SlideControlsProvider>
  );
}
