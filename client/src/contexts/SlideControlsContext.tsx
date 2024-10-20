"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
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
  const { socket, totalSlides, setTotalSlides, setFirstSlideChanged } = useSocket();
  const { slideIndex: currentSlide, boardId, slideId } = useCanvas(); // currentSlide is a 1-based system! That means that slides have numbers 1, 2, 3, ...
  const router = useRouter();
  const SLIDE_LIMIT = 10;
  const [lastSlideDeleted, setLastSlideDeleted] = useState<boolean>(false);
  console.log("currentSlide", currentSlide);
  console.log("totalSlides", totalSlides);
  useEffect(() => {
    if (lastSlideDeleted) {
      router.push(`/user-boards/${boardId}/slides/${currentSlide - 1}`);
    }
    return () => {
      if (lastSlideDeleted) {
        setLastSlideDeleted(false);
        setTotalSlides((prev) => prev - 1);
      }
    };
  }, [boardId, currentSlide, lastSlideDeleted, router, setLastSlideDeleted, setTotalSlides]);

  function createSlide() {
    if (!socket) {
      return;
    }
    const addSlideData: AddSlideData = {
      slide: {
        slideNumber: -1, // -1 means append to the end
      },
    };
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

    if (currentSlide === totalSlides) {
      setLastSlideDeleted(true);
    } else {
      if (currentSlide === 1) {
        setFirstSlideChanged(true);
      } else {
        router.push(`/user-boards/${boardId}/slides/${Math.max(currentSlide - 1, 1)}`);
      }
      setTotalSlides((prev) => prev - 1);
    }
    const deleteSlideData: DeleteSlideData = { slide: { slideNumber: currentSlide } };
    socketEmitDeleteSlide(socket, deleteSlideData);
    toast.success(`Slide deleted successfully`, { duration: 1200 });
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
    if (slideIndex + 1 !== currentSlide) {
      router.push(`/user-boards/${boardId}/slides/${slideIndex + 1}`);
    } else {
      toast.info("You already are on slide no " + currentSlide);
    }
  };

  useEffect(() => {
    const navigateToPreviousSlide = () => {
      const prevSlide = Math.max(currentSlide - 1, 1);
      toast.info(`route to ${prevSlide}`);
      router.push(`/user-boards/${boardId}/slides/${prevSlide}`);
      setTotalSlides(totalSlides - 1);
    };

    const handleLastSlideDeletion = () => {
      setLastSlideDeleted(true);
      toast.info(`route to ${currentSlide - 1}`);
      router.push(`/user-boards/${boardId}/slides/${currentSlide - 1}`);
    };

    const handleFirstSlideDeletion = () => {
      setFirstSlideChanged(true);
      setTotalSlides(totalSlides - 1);
    };

    function onSlideAdded() {
      toast.info("A slide has been added");
      setTotalSlides(totalSlides + 1);
    }

    function onSlideDeleted(res: SlideDeletedResponse) {
      // if res.slideNumber === current slide:
      //  - if current slide ===  1, setFirstSlideChanged(true),setTotalSlides(totalSlides - 1)
      //  - if 1 < current slide < totalSlides, go to the previous slide,setTotalSlides(totalSlides - 1)
      //  - if currentSlide === totalSlides, setLastSlideDeleted(true), go to the previous slide,setTotalSlides(totalSlides - 1)

      // if deleted slide is not the current slide:
      //  - if currentSlide > res.slideNumber, go to the previous slide,setTotalSlides(totalSlides - 1)
      //  - if currentSlide < res.slideNumber, nothing, setTotalSlides(totalSlides - 1)
      //  - if currentSlide === totalSlides, setLastSlideDeleted(true), go to the previous slide, setTotalSlides(totalSlides - 1)
      if (currentSlide < res.slideNumber) {
        setTotalSlides(totalSlides - 1);
      } else if (currentSlide > res.slideNumber && currentSlide < totalSlides) {
        navigateToPreviousSlide();
      } else if (currentSlide >= res.slideNumber && currentSlide === totalSlides) {
        handleLastSlideDeletion();
      } else {
        // currentSlide equals res.slideNumber but is not the last slide
        toast.warning("The slide you have been working on has been deleted");
        if (currentSlide === 1) {
          handleFirstSlideDeletion();
        } else {
          navigateToPreviousSlide();
        }
      }
    }

    socket?.on("slide-added", onSlideAdded);
    socket?.on("slide-deleted", onSlideDeleted);

    return () => {
      socket?.off("slide-added", onSlideAdded);
      socket?.off("slide-deleted", onSlideDeleted);
    };
  }, [boardId, router, totalSlides, currentSlide, socket, slideId, setTotalSlides, setFirstSlideChanged]);

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
