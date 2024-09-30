"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createBoard } from "@/app/actions/boardActions";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";

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
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to create board");
      }
    }
  };

  return (
    <Button onClick={handleCreateNewBoard} disabled={isLoading}>
      <PlusIcon className="mr-2 h-5 w-5" />
      {isLoading ? "Creating..." : "Create new board"}
    </Button>
  );
};

export default UserBoardsActionButtons;
