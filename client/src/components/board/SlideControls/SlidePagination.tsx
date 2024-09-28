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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useSlideControls } from "@/contexts/SlideControlsContext";

export function SlidePagination() {
  const { currentSlideIndex, totalSlides, handleChangeSlide, handlePrevious, handleNext } = useSlideControls();
  const slideInputRef = useRef<HTMLInputElement>(null);

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
      for (let i = 0; i < total; i++) {
        items.push(i);
      }
    } else {
      items.push(0);

      if (current > 2) {
        items.push("ellipsis");
      }

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

      if (total > 1) {
        items.push(total - 1);
      }
    }

    return items;
  };

  const pageItems = getPageItems(currentSlideIndex, totalSlides);

  return (
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
          {currentSlideIndex < totalSlides - 1 && (
            <PaginationItem>
              <PaginationNext href="#" onClick={handleNext} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
