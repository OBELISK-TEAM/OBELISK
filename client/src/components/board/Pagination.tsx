"use client";
import React, { useRef } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useCanvas } from "@/contexts/CanvasContext";
import { useRouter } from "next/navigation";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import { toast } from "sonner";
import {
  createSlide as createSlideAction,
  deleteSlide as deleteSlideAction,
  revalidateSlidePath,
} from "@/app/actions/slideActions";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteSlideDialog } from "@/components/board/DeleteSlideModal";

export function BoardPagination() {
  const router = useRouter();
  const { boardData } = useCanvas();
  const { _id: boardId, slides, slide } = boardData;
  const currentSlideIndex = slides.findIndex((s) => s === slide?._id);
  const totalSlides = slides.length;
  const SLIDE_LIMIT = 10;
  const slideInputRef = useRef<HTMLInputElement>(null);
  if (!boardId || !slides || !slide) {
    return null;
  }
  const handlePrevious = async () => {
    if (currentSlideIndex > 0) {
      await revalidateSlidePath(boardId, currentSlideIndex);
      router.push(`/user-boards/${boardId}/slides/${currentSlideIndex - 1}`);
    }
  };

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
        console.log("Refreshed");
      } else {
        router.push(`/user-boards/${boardId}/slides/${Math.max(currentSlideIndex - 1, 0)}`);
      }
    } catch (error: any) {
      console.error("Error deleting slide:", error);
      toast.error(error.message || "Failed to delete slide");
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

  const handleShowSlide = async () => {
    const slideNumber = slideInputRef.current?.value;
    if (slideNumber) {
      const index = parseInt(slideNumber, 10) - 1;
      if (index >= 0 && index < totalSlides) {
        await handleChangeSlide(index);
      }
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
    <div className="flex items-center justify-between border-t p-2">
      <div className="flex flex-grow items-center"></div>

      <div className="flex max-w-[33%] flex-grow justify-center">
        <Pagination className="flex items-center space-x-2">
          <PaginationContent>
            {currentSlideIndex > 0 && (
              <PaginationItem>
                <PaginationPrevious href="#" onClick={handlePrevious} />
              </PaginationItem>
            )}
            {pageItems.map((item, index) => {
              if (item === "ellipsis") {
                return (
                  <HoverCard closeDelay={200} key={`hover-card-${index}`}>
                    <HoverCardTrigger asChild>
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="h-4 cursor-pointer transition-transform duration-200 hover:text-blue-500" />
                      </PaginationItem>
                    </HoverCardTrigger>
                    <HoverCardContent className="mt-4 w-48 p-4">
                      <div className="flex flex-col items-center">
                        <span>Enter slide number:</span>
                        <Input
                          ref={slideInputRef}
                          type="number"
                          min="1"
                          max={totalSlides}
                          className="w-full rounded border px-2 py-1"
                        />
                        <Button onClick={handleShowSlide} className="mt-2 w-full rounded px-3 py-1">
                          Show Slide
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              } else {
                return (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === currentSlideIndex}
                      onClick={() => handleChangeSlide(item)}
                    >
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
      </div>

      <div className="flex max-w-[33%] flex-grow items-center justify-end space-x-4">
        <Button variant="outline" onClick={createSlide}>
          <PlusIcon size={16} className="mr-2 h-5 w-5" />
          Create slide
        </Button>

        <DeleteSlideDialog deleteSlide={deleteSlide} />
      </div>
    </div>
  );
}
