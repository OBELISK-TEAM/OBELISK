"use client";
import { Button } from "@/components/ui/button";
import { FilterIcon, ViewIcon, PlusIcon } from "lucide-react";
import { CreateBoardDialog } from "@/components/user-boards/CreateBoardDialog";
import { useCreateBoard } from "@/contexts/CreateBoardContext";

const UserBoardsActionButtons = () => {
  const { isLoading, createNewBoard } = useCreateBoard();

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
      <CreateBoardDialog action={createNewBoard}>
        <Button disabled={isLoading}>
          <PlusIcon className="mr-2 h-5 w-5" />
          {isLoading ? "Creating..." : "Create new board"}
        </Button>
      </CreateBoardDialog>
    </div>
  );
};

export default UserBoardsActionButtons;
