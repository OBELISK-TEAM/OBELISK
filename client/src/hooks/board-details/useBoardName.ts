"use client";
import { useReducer } from "react";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import logger from "@/lib/logger";

type State = {
  name: string;
  isEditing: boolean;
  updating: boolean;
};

type Action =
  | { type: "SET_NAME"; payload: string }
  | { type: "START_EDITING" }
  | { type: "CANCEL_EDITING"; payload: string }
  | { type: "START_UPDATING" }
  | { type: "FINISH_UPDATING" }
  | { type: "SET_NAME_FROM_BOARD"; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "START_EDITING":
      return { ...state, isEditing: true };
    case "CANCEL_EDITING":
      return { ...state, isEditing: false, name: action.payload };
    case "START_UPDATING":
      return { ...state, updating: true };
    case "FINISH_UPDATING":
      return { ...state, updating: false, isEditing: false };
    case "SET_NAME_FROM_BOARD":
      return { ...state, name: action.payload };
    default:
      return state;
  }
};

export const useBoardName = (board: BoardResponse | undefined, action: (obj: any) => void) => {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    isEditing: false,
    updating: false,
  });
  const { name, isEditing, updating } = state;

  const setName = (name: string) => {
    dispatch({ type: "SET_NAME", payload: name });
  };

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
    if (trimmedName === board.name) {
      dispatch({ type: "FINISH_UPDATING" });
      return;
    }

    try {
      dispatch({ type: "START_UPDATING" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: JIRA[OK-212] implement action of updating the board name
      // await action({ name: trimmedName, _id: board._id });
      logger.log("need to use somewhere action otherwise linter will do brrr", JSON.stringify(action));
      throw new Error("Not implemented");
      toast.success("Board name updated successfully");
    } catch (error: any) {
      logger.error("Error while creating object:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to rename the board");
      }
    } finally {
      dispatch({ type: "FINISH_UPDATING" });
    }
  };

  return {
    name,
    isEditing,
    updating,
    setName,
    handleEditClick,
    handleCancel,
    handleConfirm,
  };
};
