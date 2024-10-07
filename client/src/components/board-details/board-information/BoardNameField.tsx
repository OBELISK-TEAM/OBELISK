import React, { KeyboardEvent } from "react";
import { Square, Pencil, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoardInfoItem from "./BoardInfoItem";

interface BoardNameFieldProps {
  name: string;
  isEditing: boolean;
  updating: boolean;
  setName: (name: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleEditClick: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const BoardNameField: React.FC<BoardNameFieldProps> = ({
  name,
  isEditing,
  updating,
  setName,
  handleKeyDown,
  handleEditClick,
  handleConfirm,
  handleCancel,
}) => (
  <BoardInfoItem
    icon={<Square className="mr-1 h-4 w-4" />}
    label="Board name"
    value={name}
    isEditing={isEditing}
    onKeyDown={handleKeyDown}
    inputProps={{
      id: "board-name",
      onChange: (e) => setName(e.target.value),
      placeholder: "Board Name",
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

export default BoardNameField;
