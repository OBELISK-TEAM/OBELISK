"use client";

import { useSlideControls } from "@/contexts/SlideControlsContext";
import { ExtendedPagination } from "@/components/ExtendedPagination";

export function SlidePagination() {
  const { currentSlide, totalSlides, handleChangeSlide, handlePrevious, handleNext } = useSlideControls();
  const currentSlideIndex = currentSlide - 1; // we need to lower the number by one, because ExtendedPagination is 0-based system, whereas currentSlide is 1-based system
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
