"use client";
import React from "react";
import { SlidePagination } from "@/components/board/SlideControls/SlidePagination";
import { SlideActions } from "@/components/board/SlideControls/SlideActions";
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
