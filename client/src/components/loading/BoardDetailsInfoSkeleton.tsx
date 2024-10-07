// SkeletonBoardDetails.tsx

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardHeader } from "@/components/user-boards/BoardHeader";

const SkeletonBoardDetails: React.FC = () => {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow">
      {/* Header */}
      <header className="flex items-center justify-between gap-6 p-2">
        <BoardHeader
          title="Board Details"
          description="Detailed information regarding everything connected to this board"
        />
        <Skeleton className="h-8 w-32 rounded-md" />
      </header>

      {/* Main Content */}
      <main className="mt-4 flex flex-col flex-wrap gap-24 p-2 lg:flex-row">
        {/* Left Column */}
        <article className="flex flex-col lg:flex-[2]">
          {/* Board Name Skeleton */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-2 h-10 w-full" />
          </div>

          {/* Owner Skeleton */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mt-2 h-10 w-full" />
          </div>

          {/* Creation Date Skeleton */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-4 w-4" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mt-2 h-10 w-full" />
          </div>

          {/* Last Updated Skeleton */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-2 h-10 w-full" />
          </div>

          {/* Used Space Skeleton */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="mt-2 h-4 w-full" />
          </div>

          {/* Number of Slides Skeleton */}
          <div className="mb-4 flex flex-col gap-1">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-2 h-8 w-20" />
          </div>
        </article>

        {/* Collaborating Users Skeleton */}
        <div className="max-h-[480px] overflow-y-scroll lg:flex-[1]">
          <div className="p-4">
            {/* Card Header Skeleton */}
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="mb-4 h-4 w-48" />

            {/* User Rows Skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default SkeletonBoardDetails;
