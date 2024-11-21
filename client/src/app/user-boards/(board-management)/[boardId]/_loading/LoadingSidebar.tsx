import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonSidebar: React.FC = () => {
  return (
    <div
      className="transition-width group sticky top-[64px] flex w-14 flex-col justify-between border-r border-border bg-background shadow-md duration-300 ease-in-out hover:w-52"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="flex flex-col space-y-2 p-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Skeleton className="h-6 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonSidebar;
