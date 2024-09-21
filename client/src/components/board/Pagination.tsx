"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis, // Import the PaginationEllipsis component
} from "@/components/ui/pagination";
import { useCanvas } from "@/contexts/CanvasContext";
import { useRouter } from "next/navigation";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import { toast } from "sonner";
import { createSlide, revalidateSlidePath } from "@/app/actions/slideActions";

export function BoardPagination() {
  const router = useRouter();
  const { boardData } = useCanvas();
  const { _id: boardId, slides, slide } = boardData;
  const currentSlideIndex = slides.findIndex((s) => s === slide?._id);
  const totalSlides = slides.length;
  const SLIDE_LIMIT = 10;

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
      try {
        await revalidateSlidePath(boardId, currentSlideIndex);
        await createSlide(boardId);
        router.push(`/user-boards/${boardId}/slides/${totalSlides}`);
      } catch (error: any) {
        console.error("Error creating new slide:", error);
        if (error instanceof ApiError) {
          complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
        } else {
          toast.error(error.message || "Failed to create a new slide");
        }
      }
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

  const getPageItems = (current: number, total: number) => {
    const items: (number | "ellipsis")[] = [];

    if (total <= 5) {
      // Show all page numbers if total slides are less than or equal to 5
      for (let i = 0; i < total; i++) {
        items.push(i);
      }
    } else {
      // Always include the first page!!!
      items.push(0);

      if (current > 2) {
        items.push("ellipsis");
      }

      // Determine the range of page numbers to display around the current page :)
      const startPage = Math.max(1, current - 1);
      const endPage = Math.min(total - 2, current + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 0 && i !== total - 1) {
          items.push(i);
        }
      }

      if (current < total - 3) {
        items.push("ellipsis");
      }

      // Always include the last page!!!
      if (total > 1) {
        items.push(total - 1);
      }
    }

    return items;
  };

  const pageItems = getPageItems(currentSlideIndex, totalSlides);

  return (
    <Pagination className="mt-[0.3em] flex items-center space-x-2">
      <PaginationContent>
        {currentSlideIndex > 0 && (
          <PaginationItem>
            <PaginationPrevious href="#" onClick={handlePrevious} />
          </PaginationItem>
        )}
        {pageItems.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          } else {
            return (
              <PaginationItem key={item}>
                <PaginationLink href="#" isActive={item === currentSlideIndex} onClick={() => handleChangeSlide(item)}>
                  {item + 1}
                </PaginationLink>
              </PaginationItem>
            );
          }
        })}
        {currentSlideIndex < SLIDE_LIMIT - 1 && (
          <PaginationItem>
            {currentSlideIndex === totalSlides - 1 ? (
              <PaginationNext text={"Create Slide"} href="#" onClick={handleNext} />
            ) : (
              <PaginationNext href="#" onClick={handleNext} />
            )}
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
