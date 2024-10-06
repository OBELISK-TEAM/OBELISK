"use client";
import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useCanvas } from "./CanvasContext";
import { useSocket } from "./SocketContext";

import { toast } from "sonner";
import { AddSlideData, DeleteSlideData } from "@/interfaces/socket/SocketEmitsData";

interface SlideControlsContext {
  currentSlide: number;
  totalSlides: number;
  SLIDE_LIMIT: number;
  createSlide: () => void;
  deleteSlide: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleChangeSlide: (slideIndex: number) => void;
}

const SlideControlsContext = createContext<SlideControlsContext | undefined>(undefined);

export const SlideControlsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { socket, totalSlidesNumber: totalSlides } = useSocket();
  const { slideNumber: currentSlide, boardId } = useCanvas();
  const router = useRouter();
  const SLIDE_LIMIT = 10;

  function createSlide() {
    const addSlideData: AddSlideData = {};
    socket?.emit("add-slide", addSlideData);
  }

  const deleteSlide = () => {
    if (!currentSlide) {
      return;
    }
    if (totalSlides === 1) {
      toast.error("You cannot delete the only remaining slide");
      return;
    }

    const deleteSlideData: DeleteSlideData = { slide: { slideNumber: currentSlide } };
    socket?.emit("delete-slide", deleteSlideData);
    toast.success(`Slide deleted successfully`, { duration: 1200 });

    router.push(`/user-boards/${boardId}/slides/${Math.max(currentSlide - 1, 1)}`);
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      router.push(`/user-boards/${boardId}/slides/${currentSlide - 1}`);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      router.push(`/user-boards/${boardId}/slides/${currentSlide + 1}`);
    }
  };

  const handleChangeSlide = (slideIndex: number) => {
    if (slideIndex !== currentSlide) {
      router.push(`/user-boards/${boardId}/slides/${slideIndex}`);
    }
  };

  return (
    <SlideControlsContext.Provider
      value={{
        currentSlide,
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
