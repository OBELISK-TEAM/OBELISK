"use client";

import { Button } from "@/components/ui/button";
import { FilterIcon, ViewIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createBoard } from "@/app/actions/boardActions";

const UserBoardsActionButtons = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewBoard = async () => {
    setIsLoading(true);
    try {
      const { _id } = await createBoard();
      router.push(`/user-boards/${_id}/slides/0`);
      toast.success("Board created successfully");
    } catch (error: any) {
      setIsLoading(false);
      console.error("Error in handleCreateNewBoard:", error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline">
        <FilterIcon className="mr-2 h-5 w-5" />
        Filter
      </Button>
      <Button variant="outline">
        <ViewIcon className="mr-2 h-5 w-5" />
        View
      </Button>
      <Button onClick={handleCreateNewBoard} disabled={isLoading}>
        <PlusIcon className="mr-2 h-5 w-5" />
        {isLoading ? "Creating..." : "Create new board"}
      </Button>
    </div>
  );
};

export default UserBoardsActionButtons;
