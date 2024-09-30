"use client";
import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useCanvas } from "@/contexts/CanvasContext";
import { toast } from "sonner";
import { createSlide as createSlideAction, deleteSlide as deleteSlideAction } from "@/app/actions/slideActions";
import { useServerAction } from "@/hooks/useServerAction";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import { ApiError } from "@/errors/ApiError"; // Importuj hook

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
  const { boardData, mutateBoardData } = useCanvas();
  const { _id: boardId, slides, slide } = boardData;
  const currentSlideIndex = boardData.slides.findIndex((s) => s === boardData.slide?._id);
  const totalSlides = slides.length;
  const SLIDE_LIMIT = 10;

  const [createSlide, isCreatingSlide] = useServerAction(async () => {
    try {
      await createSlideAction(boardId);
      router.push(`/user-boards/${boardId}/slides/${totalSlides}`);
    } catch (error: any) {
      console.error("Error creating new slide:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to create a new slide");
      }
    }
  });

  const [deleteSlide, isDeletingSlide] = useServerAction(async () => {
    if (!boardId || !slide) {
      return;
    }
    if (totalSlides === 1) {
      toast.error("You cannot delete the slide as it is the only slide in the board");
      return;
    }
    try {
      await deleteSlideAction(slide._id);
      toast.success(`Slide deleted successfully`, { duration: 1200 });

      if (currentSlideIndex === totalSlides - 1) {
        const index = Math.max(totalSlides - 2, 0);
        router.push(`/user-boards/${boardId}/slides/${index}`);
      } else {
        await mutateBoardData();
        router.push(`/user-boards/${boardId}/slides/${currentSlideIndex}`);
      }
    } catch (error: any) {
      console.error("Error deleting slide:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to delete slide");
      }
    }
  });

  const handlePrevious = async () => {
    if (currentSlideIndex > 0) {
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex - 1}`);
    }
  };

  const handleNext = async () => {
    if (currentSlideIndex < totalSlides - 1) {
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex + 1}`);
    }
  };

  const handleChangeSlide = async (slideIndex: number) => {
    if (slideIndex === currentSlideIndex) {
      return;
    }
    router.push(`/user-boards/${boardId}/slides/${slideIndex}`);
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
      <div className={isCreatingSlide || isDeletingSlide ? "pointer-events-none cursor-not-allowed opacity-60" : ""}>
        {children}
      </div>
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
