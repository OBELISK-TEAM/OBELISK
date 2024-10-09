"use client";
import React, { KeyboardEvent, useEffect } from "react";
import { Square, Pencil, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardInfoInputItem from "@/components/board-details/board-information/BoardInfoInputItem";
import { useBoardName } from "@/hooks/board-details/useBoardName";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";

interface BoardNameFieldProps {
  board: BoardResponse | undefined;
  id: string;
  mutate: () => void;
}

const BoardNameField: React.FC<BoardNameFieldProps> = ({ board, id, mutate }) => {
  const { name, isEditing, updating, setName, handleEditClick, handleCancel, handleConfirm } = useBoardName(
    board,
    mutate
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  useEffect(() => {
    if (board) {
      setName(board.name);
    }
  }, [board]);

  return (
    <BoardInfoInputItem
      label="Board name"
      value={name}
      isEditing={isEditing}
      onKeyDown={handleKeyDown}
      id={id}
      inputProps={{
        id: "board-name",
        placeholder: "Board Name",
        onChange: (e) => setName(e.target.value),
      }}
      actions={
        isEditing ? (
          <div className="ml-2 flex items-center gap-2">
            <Button
              aria-label="Confirm name"
              onClick={handleConfirm}
              className={updating ? "cursor-not-allowed opacity-50" : ""}
              disabled={updating}
            >
              <div className="flex items-center gap-2">
                <Save size={12} />
                <span>Save</span>
              </div>
            </Button>
            <Button
              aria-label="Cancel edit"
              variant="secondary"
              onClick={handleCancel}
              className={updating ? "cursor-not-allowed opacity-50" : ""}
            >
              <div className="flex items-center gap-2">
                <XCircle size={12} />
                <span>Cancel</span>
              </div>
            </Button>
          </div>
        ) : (
          <Button variant="secondary" aria-label="Edit name" onClick={handleEditClick} className="ml-2">
            <div className="flex items-center gap-2">
              <Pencil size={12} />
              <span>Edit</span>
            </div>
          </Button>
        )
      }
    />
  );
};

export default BoardNameField;
