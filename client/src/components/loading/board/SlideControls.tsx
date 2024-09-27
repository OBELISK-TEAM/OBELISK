import { SlidePaginationSkeleton } from "@/components/loading/board/SlidePagination";
import { SlideActionsSkeleton } from "@/components/loading/board/SlideActions";

import React from "react";

export const SlideControlsSkeleton = () => (
  <div className="flex w-[100%] items-center justify-between border-t p-2">
    <div className="flex flex-grow items-center"></div>
    <SlidePaginationSkeleton />
    <SlideActionsSkeleton />
  </div>
);
