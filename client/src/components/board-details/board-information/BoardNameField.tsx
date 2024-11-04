"use client";

import React, { KeyboardEvent, useState } from "react";
import { Pencil, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardInfoInputItem from "@/components/board-details/board-information/BoardInfoInputItem";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { updateBoardName } from "@/app/actions/boardActions";
import { toast } from "sonner";
import { ApiError } from "@/errors/ApiError";
import { complexToast } from "@/contexts/complexToast";
import { ToastTypes } from "@/enums/ToastType";
import logger from "@/lib/logger";
import { z } from "zod";

export const boardNameSchema = (currentName: string) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(30, "Name must be at most 30 characters")
      .refine((val) => val !== currentName, "Name must be different from the current name"),
  });

interface BoardNameFieldProps {
  board: BoardDetailsResponse | undefined;
  id: string;
}

interface FormValues {
  name: string;
}

const BoardNameField: React.FC<BoardNameFieldProps> = ({ board, id }) => {
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
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
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid && !isSubmitting) {
      handleSubmit(onSubmit)();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <>
      {isEditing && errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <BoardInfoInputItem
              label="Board name"
              value={field.value}
              isEditing={isEditing}
              onKeyDown={handleKeyDown}
              id={id}
              inputProps={{
                id: "board-name",
                placeholder: "Board Name",
                onChange: field.onChange,
                onBlur: field.onBlur,
                value: field.value,
              }}
              actions={
                isEditing ? (
                  <div className="ml-2 flex items-center gap-2">
                    <Button
                      type="submit"
                      aria-label="Confirm name"
                      className={isSubmitting ? "cursor-not-allowed opacity-50" : ""}
                      disabled={!isValid || isSubmitting}
                    >
                      <div className="flex items-center gap-2">
                        <Save size={12} />
                        <span>Save</span>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      aria-label="Cancel edit"
                      variant="secondary"
                      onClick={handleCancel}
                      className={isSubmitting ? "cursor-not-allowed opacity-50" : ""}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-center gap-2">
                        <XCircle size={12} />
                        <span>Cancel</span>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    aria-label="Edit name"
                    onClick={() => setIsEditing(true)}
                    className="ml-2"
                  >
                    <div className="flex items-center gap-2">
                      <Pencil size={12} />
                      <span>Edit</span>
                    </div>
                  </Button>
                )
              }
            />
          )}
        />
      </form>
    </>
  );
};

export default BoardNameField;
