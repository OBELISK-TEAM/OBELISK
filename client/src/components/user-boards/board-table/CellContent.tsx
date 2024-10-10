import React from "react";
import { Badge } from "@/components/ui/badge";
import { concatenatePermissions, getPermissionLabel, getPermissionVariant } from "@/lib/userBoardsUtils";
import { BoardResponse } from "@/interfaces/responses/user-boards/board-response";
import { BoardTableColumns } from "@/enums/BoardTableColumns";
import { prettyDate } from "@/lib/dateUtils";
import { bytesToKilobytes } from "@/lib/bytesConverter";
export const CellContent = (column: BoardTableColumns, board: BoardResponse) => {
  let sharedUsers: string[] = [];
  if (board.permissions) {
    sharedUsers = concatenatePermissions(board.permissions);
  }

  switch (column) {
    case BoardTableColumns.NAME:
      return board.name;

    case BoardTableColumns.OWNER:
      return board?.owner?.email ?? "You";

    case BoardTableColumns.MODIFIED_AT:
      return prettyDate(board.updatedAt);

    case BoardTableColumns.CREATED_AT:
      return prettyDate(board.createdAt);

    case BoardTableColumns.MY_PERMISSION:
      if (board.permission) {
        return <Badge variant={getPermissionVariant(board.permission)}>{getPermissionLabel(board.permission)}</Badge>;
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

    case BoardTableColumns.SIZE:
      return `${bytesToKilobytes(board.size ?? 0)} kB`;

    default:
      return "";
  }
};
