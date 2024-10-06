"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createBoard } from "@/app/actions/boardActions";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";

interface CreateBoardContextType {
  isLoading: boolean;
  createNewBoard: (values: { boardName: string }) => Promise<void>;
}

const CreateBoardContext = createContext<CreateBoardContextType | undefined>(undefined);

export const CreateBoardProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const createNewBoard = async (values: { boardName: string }) => {
    setIsLoading(true);
    try {
      const { _id } = await createBoard(values.boardName);
      router.push(`/user-boards/${_id}/slides/0`);
      toast.success("Board created successfully");
    } catch (error: any) {
      console.error("Error in handleCreateNewBoard:", error);
      if (error instanceof ApiError) {
        setIsLoading(false);
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to create board");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return <CreateBoardContext.Provider value={{ isLoading, createNewBoard }}>{children}</CreateBoardContext.Provider>;
};

export const useCreateBoard = () => {
  const context = useContext(CreateBoardContext);
  if (!context) {
    throw new Error("useCreateBoardContext must be used within a CreateBoardProvider");
  }
  return context;
};
