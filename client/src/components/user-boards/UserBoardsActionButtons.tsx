"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon, ViewIcon, PlusIcon } from "lucide-react";
import { CreateBoardDialog } from "@/components/user-boards/CreateBoardDialog";
import { useRouter } from "next/navigation";
import { createBoard } from "@/app/actions/boardActions";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";

const UserBoardsActionButtons = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateNewBoard = async (values: { boardName: string }) => {
    setIsLoading(true);
    try {
      const { _id } = await createBoard(values.boardName);
      router.push(`/user-boards/${_id}/slides/0`);
      toast.success("Board created successfully");
    } catch (error: any) {
      console.error("Error in handleCreateNewBoard:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to create board");
      }
    } finally {
      setIsLoading(false);
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
      <CreateBoardDialog action={handleCreateNewBoard}>
        <Button disabled={isLoading}>
          <PlusIcon className="mr-2 h-5 w-5" />
          {isLoading ? "Creating..." : "Create new board"}
        </Button>
      </CreateBoardDialog>
    </div>
  );
};

export default UserBoardsActionButtons;
