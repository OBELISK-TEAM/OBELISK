"use client";
import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useCanvas } from "@/contexts/CanvasContext";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import { toast } from "sonner";
import {
  createSlide as createSlideAction,
  deleteSlide as deleteSlideAction,
  revalidateSlidePath,
} from "@/app/actions/slideActions";

interface SlideControlsContext {
  currentSlideIndex: number;
  totalSlides: number;
  SLIDE_LIMIT: number;
  createSlide: () => Promise<void>;
  deleteSlide: () => Promise<void>;
  handlePrevious: () => Promise<void>;
  handleNext: () => Promise<void>;
  handleChangeSlide: (slideIndex: number) => Promise<void>;
}

const SlideControlsContext = createContext<SlideControlsContext | undefined>(undefined);

export const SlideControlsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { boardData } = useCanvas();
  const { _id: boardId, slides, slide } = boardData;
  const currentSlideIndex = slides.findIndex((s) => s === slide?._id);
  const totalSlides = slides.length;
  const SLIDE_LIMIT = 10;

  const createSlide = async () => {
    try {
      await revalidateSlidePath(boardId, currentSlideIndex);
      await createSlideAction(boardId);
      router.push(`/user-boards/${boardId}/slides/${totalSlides}`);
      toast.success("Slide created successfully");
    } catch (error: any) {
      console.error("Error creating new slide:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to create a new slide");
      }
    }
  };

  const deleteSlide = async () => {
    if (!boardId || !slide) {
      return;
    }
    if (totalSlides === 1) {
      toast.error("You cannot delete slide as it is the only slide in the board");
      return;
    }
    try {
      await deleteSlideAction(slide._id);
      toast.success(`Slide deleted successfully`);
      if (currentSlideIndex === 0) {
        await revalidateSlidePath(boardId, currentSlideIndex);
        router.refresh();
      } else {
        router.push(`/user-boards/${boardId}/slides/${Math.max(currentSlideIndex - 1, 0)}`);
      }
    } catch (error: any) {
      console.error("Error deleting slide:", error);
      toast.error(error.message || "Failed to delete slide");
    }
  };

  const handlePrevious = async () => {
    if (currentSlideIndex > 0) {
      await revalidateSlidePath(boardId, currentSlideIndex);
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex - 1}`);
    }
  };

  const handleNext = async () => {
    if (currentSlideIndex < totalSlides - 1) {
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex + 1}`);
    } else if (totalSlides < SLIDE_LIMIT) {
      await createSlide();
    }
  };

  const handleChangeSlide = async (slideIndex: number) => {
    if (slideIndex === currentSlideIndex) {
      return;
    }
    try {
      await revalidateSlidePath(boardId, slideIndex);
      router.push(`/user-boards/${boardId}/slides/${slideIndex}`);
    } catch (error) {
      console.error("Error revalidating path:", error);
      toast.error("Failed to revalidate slide");
    }
  };

  return (
    <SlideControlsContext.Provider
      value={{
        currentSlideIndex,
        totalSlides,
        SLIDE_LIMIT,
        createSlide,
        deleteSlide,
        handlePrevious,
        handleNext,
        handleChangeSlide,
      }}
    >
      {children}
    </SlideControlsContext.Provider>
  );
};

export const useSlideControls = () => {
  const context = useContext(SlideControlsContext);
  if (!context) {
    throw new Error("useSlides must be used within a SlideProvider");
  }
  return context;
};
