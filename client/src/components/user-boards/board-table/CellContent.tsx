import React from "react";
import { Badge } from "@/components/ui/badge";
import { concatenatePermissions, getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { BoardTableColumns } from "@/enums/BoardTableColumns";
export const CellContent = (column: BoardTableColumns, board: BoardResponse) => {
  const sharedUsers = concatenatePermissions(board.sharedWith);
  switch (column) {
    case BoardTableColumns.NAME:
      return board.name;

    case BoardTableColumns.OWNER:
      return board.owner ? board.owner : "You";

    case BoardTableColumns.MODIFIED_AT:
      return board.modifiedAt;

    case BoardTableColumns.CREATED_AT:
      return board.createdAt;

    case BoardTableColumns.MY_PERMISSION:
      if (board.myPermission) {
        return (
          <Badge variant={getPermissionVariant(board.myPermission)}>{getPermissionLabel(board.myPermission)}</Badge>
        );
      } else {
        return "---";
      }

    case BoardTableColumns.SHARED_WITH:
      return (
        <div className="flex flex-col items-start space-y-1">
          {sharedUsers && sharedUsers.length > 0 ? (
            <>
              {sharedUsers.length > 2 ? (
                <>
                  <Badge>{sharedUsers[0]}</Badge>
                  <span className="text-xs text-muted-foreground">... (+{sharedUsers.length - 1} more)</span>
                </>
              ) : (
                sharedUsers.map((user: string) => <Badge key={user}>{user}</Badge>)
              )}
            </>
          ) : (
            "---"
          )}
        </div>
      );

    case BoardTableColumns.SIZE_IN_KB:
      return `${board.size} kB`;

    default:
      return "";
  }
};