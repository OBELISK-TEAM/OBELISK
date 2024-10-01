"use client";

import { useSlideControls } from "@/contexts/SlideControlsContext";
import { ExtendedPagination } from "@/components/ExtendedPagination";

export function SlidePagination() {
  const { currentSlideIndex, totalSlides, handleChangeSlide, handlePrevious, handleNext } = useSlideControls();
  return (
    <ExtendedPagination
      currentPage={currentSlideIndex}
      totalPages={totalSlides}
      onPageChange={handleChangeSlide}
      handlePrevious={handlePrevious}
      handleNext={handleNext}
      text={"slide"}
      className={"flex max-w-[33%] flex-grow justify-center"}
    />
  );
}
