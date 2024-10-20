// components/board-details/board-permissions/SkeletonBoardPermissions.tsx

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardHeader } from "@/components/user-boards/BoardHeader";

const SkeletonBoardPermissions: React.FC = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow">
      <div className="mb-6">
        <BoardHeader title="Board permissions" description="How others can collaborate with you on this board">
          <Skeleton className="h-6 w-6 rounded-full" />
        </BoardHeader>

        <div className="flex items-end justify-between p-2">
          <div className="mt-12 flex items-center space-x-4">
            <span className="text-muted-foreground">Board owner:</span>
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      <div>
        <div className="mb-4 flex space-x-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              {/* Permission */}
              <Skeleton className="h-4 w-24" />

              {/* Actions */}
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonBoardPermissions;
