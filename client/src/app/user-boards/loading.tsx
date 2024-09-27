// app/user-boards/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { SidebarSkeleton } from "@/components/loading/Sidebar";

export default function LoadingUserBoards() {
  return (
    <div className="h-min-[100vh] flex flex-col">
      {/* Skeleton for Header */}
      <div className="flex h-[64px] items-center justify-between border-b bg-background pl-0">
        {/* Left Section */}
        <div className="flex items-center">
          {/* Logo Skeleton */}
          <Skeleton className="h-[64px] w-[56px] border-r" />
          {/* Header Links Skeleton */}
          <div className="ml-4 flex space-x-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            {/* Add more if needed */}
          </div>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-4 pr-6">
          {/* User Name Skeleton */}
          <Skeleton className="h-6 w-24" />
          {/* Avatar Skeleton */}
          <Skeleton className="h-10 w-10 rounded-full" />
          {/* Theme Toggle Skeleton */}
          <Skeleton className="h-8 w-8" />
          {/* Logout Button Skeleton */}
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="flex">
        <SidebarSkeleton count={3} className={"border-r"} withSettings={true} />

        {/* Main Content Area */}
        <main className="flex-1 bg-background p-6">
          {/* Skeleton for Tabs and Action Buttons */}
          <div className="mb-2 flex items-center justify-between">
            {/* Skeleton for TabButtons */}
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
            {/* Skeleton for UserBoardsActionButtons */}
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Skeleton for BoardTable */}
          <div className="rounded-lg border bg-card p-4">
            {/* Table Title Skeleton */}
            <Skeleton className="mb-2 h-6 w-32" />
            {/* Table Subtitle Skeleton */}
            <Skeleton className="mb-4 h-4 w-48" />

            {/* Table Header Skeleton */}
            <div className="mb-2 flex w-full">
              <Skeleton className="mr-2 h-4 w-6" />
              <Skeleton className="mr-2 h-4 w-24" />
              <Skeleton className="mr-2 h-4 w-16" />
              <Skeleton className="mr-2 h-4 w-12" />
              <Skeleton className="mr-2 h-4 w-24" />
              <Skeleton className="mr-2 h-4 w-24" />
            </div>

            {/* Table Rows Skeleton */}
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="mb-2 flex w-full">
                <Skeleton className="mr-2 h-4 w-6" />
                <Skeleton className="mr-2 h-4 w-24" />
                <Skeleton className="mr-2 h-4 w-16" />
                <Skeleton className="mr-2 h-4 w-12" />
                <Skeleton className="mr-2 h-4 w-24" />
                <Skeleton className="mr-2 h-4 w-24" />
              </div>
            ))}

            {/* Pagination Skeleton */}
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
