"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateBoardDialog } from "@/components/user-boards/CreateBoardDialog";
import { useCreateBoard } from "@/contexts/CreateBoardContext";

const CreateBoardButton = () => {
  const { isLoading, createNewBoard } = useCreateBoard();

  return (
    <CreateBoardDialog action={createNewBoard}>
      <Button disabled={isLoading}>
        <PlusIcon className="mr-2 h-5 w-5" />
        {isLoading ? "Creating..." : "Create new board"}
      </Button>
    </CreateBoardDialog>
  );
};

export default CreateBoardButton;
