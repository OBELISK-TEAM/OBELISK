"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCanvas } from "./CanvasContext";
import { useSocket } from "./SocketContext";

import { toast } from "sonner";
import { AddSlideData, DeleteSlideData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitAddSlide, socketEmitDeleteSlide } from "@/lib/board/socketEmitUtils";

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
  const { slideNumber: currentSlide, boardId } = useCanvas(); // currentSlide is a 1-based system! That means that slides have numbers 1, 2, 3, ...
  const router = useRouter();
  const SLIDE_LIMIT = 10;

  function createSlide() {
    if (!socket) {
      return;
    }
    const addSlideData: AddSlideData = {};
    socketEmitAddSlide(socket, addSlideData);
  }

  const deleteSlide = () => {
    if (!currentSlide || !socket) {
      return;
    }
    if (totalSlides === 1) {
      toast.error("You cannot delete the only remaining slide");
      return;
    }

    const deleteSlideData: DeleteSlideData = { slide: { slideNumber: currentSlide } };
    socketEmitDeleteSlide(socket, deleteSlideData);
    toast.success(`Slide deleted successfully`, { duration: 1200 });

    router.push(`/boards/${boardId}/slides/${Math.max(currentSlide - 1, 1)}`);
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      router.push(`/boards/${boardId}/slides/${currentSlide - 1}`);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      router.push(`/boards/${boardId}/slides/${currentSlide + 1}`);
    }
  };

  const handleChangeSlide = (slideIndex: number) => {
    if (slideIndex + 1 !== currentSlide) {
      router.push(`/boards/${boardId}/slides/${slideIndex + 1}`);
    } else {
      toast.info("You already are on slide no " + currentSlide);
    }
  };

  useEffect(() => {
    function onDeleteSlide() {
      // toast.warning("The slide you have been working on has been deleted");

      if (currentSlide === totalSlides) {
        router.push(`/boards/${boardId}/slides/${currentSlide - 1}`);
      }
    }

    socket?.on("slide-deleted", onDeleteSlide);

    return () => {
      socket?.off("slide-deleted", onDeleteSlide);
    };
  }, [boardId, router, totalSlides, currentSlide, socket]);

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
