// CellContent.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { BoardResponse } from "@/interfaces/boards/board-response";
import { getPermissionVariant } from "@/lib/userBoardsUtils";

export const CellContent = (column: string, board: BoardResponse) => {
  switch (column) {
    case "Name":
      return board.name;
    case "Owner":
      return "owner" in board ? board.owner : "You";
    case "Modified at":
      return board.modifiedAt;
    case "Created at":
      return board.createdAt;
    case "Your Permission":
      if ("yourPermission" in board && board.yourPermission) {
        return <Badge variant={getPermissionVariant(board.yourPermission)}>{board.yourPermission}</Badge>;
      } else {
        return "---";
      }
    case "Shared with":
      return (
        <div className="flex flex-col items-start space-y-1">
          {board.sharedWith && board.sharedWith.length > 0 ? (
            <>
              {board.sharedWith.length > 2 ? (
                <>
                  <Badge>{board.sharedWith[0]}</Badge>
                  <span className="text-xs text-muted-foreground">... (+{board.sharedWith.length - 1} more)</span>
                </>
              ) : (
                board.sharedWith.map((user: string) => <Badge key={user}>{user}</Badge>)
              )}
            </>
          ) : (
            "---"
          )}
        </div>
      );
    case "Size (in kB)":
      return `${board.size} kB`;
    default:
      return "";
  }
};
