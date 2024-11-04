"use client";
import { useEffect, useReducer } from "react";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import logger from "@/lib/logger";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { updateBoardName } from "@/app/actions/boardActions";
import { boardNameFieldReducer } from "@/reducers/boardNameFieldReducer";
const boardNameValidator = (name: string, prevName: string): boolean => {
  const trimmedName = name.trim();
  return trimmedName !== prevName && trimmedName.length >= 3 && trimmedName.length <= 30;
};
export const useBoardName = (board: BoardDetailsResponse | undefined) => {
  const [state, dispatch] = useReducer(boardNameFieldReducer, {
    name: "",
    isEditing: false,
    updating: false,
    isEnabledConfirmButton: false,
  });
  const { name, isEditing, updating, isEnabledConfirmButton } = state;

  const setName = (name: string) => {
    dispatch({ type: "SET_NAME", payload: { name, isValid: boardNameValidator(name, board?.name ?? "") } });
  };

  useEffect(() => {
    if (board) {
      setName(board.name);
    }
  }, [board]);

  const handleEditClick = () => {
    dispatch({ type: "START_EDITING" });
  };

  const handleCancel = () => {
    if (board) {
      dispatch({ type: "CANCEL_EDITING", payload: board.name });
    }
  };

  const handleConfirm = async () => {
    if (!board) {
      return;
    }
    const trimmedName = name.trim();
    try {
      dispatch({ type: "START_UPDATING" });
      await updateBoardName(board._id, trimmedName);
      toast.success("Board name updated successfully");
      dispatch({ type: "FINISH_UPDATING_SUCCESS" });
    } catch (error: any) {
      logger.error("Error while creating object:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to rename the board");
      }
      dispatch({ type: "FINISH_UPDATING_ERROR" });
    }
  };

  return {
    name,
    isEditing,
    updating,
    isEnabledConfirmButton,
    setName,
    handleEditClick,
    handleCancel,
    handleConfirm,
  };
};
