import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import logger from "@/lib/logger";
import { z } from "zod";
import { updateBoardName } from "@/app/actions/boardActions";

interface UseBoardNameFormProps {
  board: BoardDetailsResponse | undefined;
  onSuccess: () => void;
}

export const boardNameSchema = (currentName: string) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(3, "Board name must be at least 3 characters")
      .max(30, "Board name must be at most 30 characters")
      .refine((val) => val !== currentName, "Board name must be different from the current name"),
  });

interface FormValues {
  name: string;
}

export const useBoardNameField = ({ board, onSuccess }: UseBoardNameFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(boardNameSchema(board?.name || "")),
    mode: "onChange",
    defaultValues: {
      name: board?.name || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!board) {
      return;
    }

    try {
      await updateBoardName(board._id, data.name.trim());
      toast.success("Board name updated successfully");
      onSuccess();
      reset({ name: data.name.trim() });
    } catch (error: any) {
      logger.error("Error while updating board name:", error);
      if (error instanceof ApiError) {
        complexToast(ToastTypes.ERROR, error.messages, { duration: Infinity });
      } else {
        toast.error(error.message || "Failed to rename the board");
      }
    }
  };

  const handleCancel = () => {
    if (board) {
      reset({ name: board.name });
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    isValid,
    isSubmitting,
    handleCancel,
  };
};
