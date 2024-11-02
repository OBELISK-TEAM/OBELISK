"use client";
import React from "react";
import { SlidePagination } from "@/components/board/slide-controls/SlidePagination";
import { SlideActions } from "@/components/board/slide-controls/SlideActions";
import { SlideControlsProvider } from "@/contexts/SlideControlsContext";

export function SlideControls() {
  return (
    <SlideControlsProvider>
      <div className="flex items-center justify-between border-t p-2">
        <div className="flex flex-grow items-center"></div>
        <SlidePagination />
        <SlideActions />
      </div>
    </SlideControlsProvider>
  );
}
