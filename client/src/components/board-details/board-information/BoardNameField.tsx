"use client";

import React, { KeyboardEvent, useState } from "react";
import { Pencil, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardInfoInputItem from "@/components/board-details/board-information/BoardInfoInputItem";
import { BoardDetailsResponse } from "@/interfaces/responses/board-details-response";
import { useBoardNameField } from "@/hooks/board-details/useBoardNameField";
import { Controller } from "react-hook-form";

interface BoardNameFieldProps {
  board: BoardDetailsResponse | undefined;
  id: string;
}

const BoardNameField: React.FC<BoardNameFieldProps> = ({ board, id }) => {
  const [isEditing, setIsEditing] = useState(false);

  const { control, handleSubmit, onSubmit, errors, isValid, isSubmitting, handleCancel } = useBoardNameField({
    board,
    onSuccess: () => setIsEditing(false),
  });
  const isError = isEditing && Boolean(errors.name);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isValid && !isSubmitting) {
      handleSubmit(onSubmit)();
    } else if (e.key === "Escape") {
      handleCancel();
      setIsEditing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <BoardInfoInputItem
            label={isEditing && errors.name ? (errors.name.message ?? "") : "Board name"}
            value={field.value}
            isEditing={isEditing}
            isError={isError}
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
                    onClick={() => {
                      handleCancel();
                      setIsEditing(false);
                    }}
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
  );
};

export default BoardNameField;
