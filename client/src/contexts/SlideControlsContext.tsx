"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCanvas } from "./CanvasContext";
import { useSocket } from "./SocketContext";

import { toast } from "sonner";
import { AddSlideData, DeleteSlideData } from "@/interfaces/socket/SocketEmitsData";
import { socketEmitAddSlide, socketEmitDeleteSlide } from "@/lib/board/socketEmitUtils";
import { SlideDeletedResponse } from "@/interfaces/socket/SocketCallbacksData";

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
  const { socket, totalSlides, setTotalSlides } = useSocket();
  const { slideNumber: currentSlide, boardId, slideId } = useCanvas(); // currentSlide is a 1-based system! That means that slides have numbers 1, 2, 3, ...
  const router = useRouter();
  const SLIDE_LIMIT = 10;

  function createSlide() {
    if (!socket) {
      return;
    }
    const addSlideData: AddSlideData = {};
    socketEmitAddSlide(socket, addSlideData);
    setTotalSlides(totalSlides + 1);
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
    setTotalSlides(totalSlides - 1);

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
    function onSlideAdded() {
      toast.info("A slide has been added");
      setTotalSlides(totalSlides + 1);
    }

    function onSlideDeleted(res: SlideDeletedResponse) {
      setTotalSlides(totalSlides - 1);
      if (res._id === slideId) {
        toast.warning("The slide you have been working on has been deleted");
        // TODO: doesn't work as intended
        if (currentSlide === totalSlides) {
          toast.info(`route to ${currentSlide - 1}`);
          router.push(`/boards/${boardId}/slides/${currentSlide - 1}`);
        } else {
          toast.info(`route to refresh`);
          router.refresh();
        }
      }
    }

    socket?.on("slide-added", onSlideAdded);
    socket?.on("slide-deleted", onSlideDeleted);

    return () => {
      socket?.off("slide-added", onSlideAdded);
      socket?.off("slide-deleted", onSlideDeleted);
    };
  }, [boardId, router, totalSlides, currentSlide, socket, slideId, setTotalSlides]);

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
