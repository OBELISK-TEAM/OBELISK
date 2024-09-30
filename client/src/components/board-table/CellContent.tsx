import { LatestBoard, OwnedBoard, SharedBoard } from "@/interfaces/boards/interfaces";
import { getPermissionBgColor } from "@/lib/UserBoardsUtils";
import React from "react";

export const CellContent = (column: string, board: LatestBoard | OwnedBoard | SharedBoard) => {
  switch (column) {
    case "Name":
      return board.name;
    case "Owner":
      return "owner" in board ? board.owner : "You";
    case "Modified at":
      return board.modifiedAt;
    case "Created at":
      return board.createdAt;
    case "Your Permissions":
      if ("yourPermissions" in board && board.yourPermissions) {
        return (
          <div className="flex items-center">
            <span
              className={`rounded-full px-2 py-1 text-xs text-white ${getPermissionBgColor(board.yourPermissions)}`}
            >
              {board.yourPermissions}
            </span>
          </div>
        );
      } else {
        return "---";
      }
    case "Shared with":
      return (
        <div className="flex flex-col items-center space-y-1">
          {board.sharedWith && board.sharedWith.length > 0
            ? board.sharedWith.map((user: string) => (
                <span key={user} className="rounded-full bg-black px-2 py-1 text-xs text-white">
                  {user}
                </span>
              ))
            : "---"}
        </div>
      );
    case "Size (in kB)":
      return `${board.size} kB`;
    default:
      return "";
  }
};
