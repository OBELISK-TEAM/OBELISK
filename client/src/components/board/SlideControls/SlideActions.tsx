"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { DeleteSlideDialog } from "@/components/board/SlideControls/DeleteSlideModal";
import { useSlideControls } from "@/contexts/SlideControlsContext";

export function SlideActions() {
  const { createSlide, deleteSlide } = useSlideControls();
  return (
    <div className="flex max-w-[33%] flex-grow items-center justify-end space-x-4">
      <Button variant="outline" onClick={createSlide}>
        <PlusIcon size={16} className="mr-2 h-5 w-5" />
        Create slide
      </Button>

      <DeleteSlideDialog deleteSlide={deleteSlide} />
    </div>
  );
}
