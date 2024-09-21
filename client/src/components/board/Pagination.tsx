"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCanvas } from "@/contexts/CanvasContext";
import { useRouter } from "next/navigation";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import { toast } from "sonner";
import { createSlide } from "@/app/actions/slideActions";

export function BoardPagination() {
  const router = useRouter();
  const { boardData } = useCanvas();
  const { _id: boardId, slides, slide } = boardData;
  const currentSlideIndex = slides.findIndex((s) => s === slide?._id);
  const totalSlides = slides.length;
  const SLIDE_LIMIT = 30;
  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex - 1}`);
    }
  };

  const handleNext = async () => {
    if (currentSlideIndex < totalSlides - 1) {
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex + 1}`);
    } else {
      try {
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

  const handlePaginationLinkClick = (index: number) => {
    router.push(`/user-boards/${boardId}/slides/${index}`);
  };

  const pageNumbers = slides.map((slideId, index) => index);

  return (
    <Pagination className="mt-[0.3em] flex items-center space-x-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrevious} />
        </PaginationItem>
        {pageNumbers.map((pageIndex) => (
          <PaginationItem key={pageIndex}>
            <PaginationLink
              href="#"
              isActive={pageIndex === currentSlideIndex}
              onClick={() => handlePaginationLinkClick(pageIndex)}
            >
              {pageIndex + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href="#" onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
