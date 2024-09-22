"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DeleteSlideDialog } from "@/components/board/SlideControls/DeleteSlideDialog";
import { useSlideControls } from "@/contexts/SlideControlsContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function SlideActions() {
  const { createSlide, deleteSlide, totalSlides, SLIDE_LIMIT } = useSlideControls();
  return (
    <div className="flex max-w-[33%] flex-grow items-center justify-end space-x-4">
      <HoverCard closeDelay={200}>
        <HoverCardTrigger asChild>
          <div>
            <Button variant="outline" onClick={createSlide} disabled={totalSlides === SLIDE_LIMIT}>
              <PlusIcon size={16} className="mr-2 h-5 w-5" />
              Create slide
            </Button>
          </div>
        </HoverCardTrigger>
        {totalSlides === SLIDE_LIMIT && (
          <HoverCardContent className="mt-2 w-48 p-4 text-center">
            <span>Slides limit reached</span>
          </HoverCardContent>
        )}
      </HoverCard>

      <DeleteSlideDialog deleteSlide={deleteSlide} />
    </div>
  );
}
